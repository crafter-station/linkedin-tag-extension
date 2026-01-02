import type {
  LinkedInUser,
  LinkedInOrg,
  LinkedInEntity,
  ExtensionMessage,
  TagList,
  StorageData,
  Settings,
} from "../types";
import { DEFAULT_LIST_ID, DEFAULT_SETTINGS } from "../types";

// Debounce utility - prevents function from being called too frequently
function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return ((...args: unknown[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  }) as T;
}

// Type guard functions
function isLinkedInUser(entity: LinkedInEntity): entity is LinkedInUser {
  return entity.type === "user";
}

// Migration state - only check once per page load
let migrationComplete = false;

// Migrate legacy storage format to new format
async function migrateStorageIfNeeded(): Promise<void> {
  // Only run migration check once per page load
  if (migrationComplete) {
    return;
  }
  
  const storage = await chrome.storage.local.get(["lists", "users", "selectedListId"]);
  
  // Check if already migrated (has 'lists' key)
  if (storage.lists) {
    migrationComplete = true;
    return;
  }
  
  // Check if there's legacy data to migrate
  if (storage.users && Array.isArray(storage.users)) {
    // Add type: "user" to legacy users
    const legacyUsers = (storage.users as Array<Omit<LinkedInUser, "type">>).map((u) => ({
      ...u,
      type: "user" as const,
    }));
    const defaultList: TagList = {
      id: DEFAULT_LIST_ID,
      name: "General",
      createdAt: Date.now(),
      users: legacyUsers,
      entities: legacyUsers,
    };
    
    await chrome.storage.local.set({
      lists: [defaultList],
      selectedListId: DEFAULT_LIST_ID,
    });
    
    // Remove old 'users' key
    await chrome.storage.local.remove("users");
    console.log("[LinkedIn Tag Helper] Migrated legacy storage to new format");
  } else {
    // No data, create default list
    const defaultList: TagList = {
      id: DEFAULT_LIST_ID,
      name: "General",
      createdAt: Date.now(),
      users: [],
      entities: [],
    };
    
    await chrome.storage.local.set({
      lists: [defaultList],
      selectedListId: DEFAULT_LIST_ID,
    });
  }
  
  migrationComplete = true;
}

// Cache for storage data - persistent until explicitly invalidated
let storageCache: StorageData | null = null;

// Get storage data synchronously from cache, or null if not loaded
function getStorageDataSync(): StorageData | null {
  return storageCache;
}

// Load storage data into cache (call once on init)
async function loadStorageData(): Promise<StorageData> {
  await migrateStorageIfNeeded();
  const storage = await chrome.storage.local.get(["lists", "selectedListId"]);
  
  storageCache = {
    lists: storage.lists || [],
    selectedListId: storage.selectedListId || DEFAULT_LIST_ID,
  };
  
  return storageCache;
}

// Get storage data - returns cache immediately if available, otherwise loads
async function getStorageData(): Promise<StorageData> {
  if (storageCache) {
    return storageCache;
  }
  return loadStorageData();
}

// Invalidate cache (will reload on next access)
function invalidateStorageCache(): void {
  storageCache = null;
}

// Invalidate and reload cache when storage changes
async function refreshStorageCache(): Promise<void> {
  storageCache = null;
  await loadStorageData();
}

// Extract entity URN from various sources on the page
function extractEntityUrn(): string | null {
  // Strategy 1: Look for connectionOf= in any link (URL encoded format)
  const connectionOfLinks = document.querySelectorAll('a[href*="connectionOf="]');
  for (const link of connectionOfLinks) {
    const href = link.getAttribute("href") || "";
    const match = href.match(/connectionOf=%5B%22([^%]+)%22%5D/);
    if (match?.[1]) {
      return match[1];
    }
  }

  // Strategy 2: Look for facetConnectionOf= in any link
  const facetLinks = document.querySelectorAll('a[href*="facetConnectionOf="]');
  for (const link of facetLinks) {
    const href = link.getAttribute("href") || "";
    const match = href.match(/facetConnectionOf=%22([^%]+)%22/);
    if (match?.[1]) {
      return match[1];
    }
  }

  // Strategy 3: Look for profileUrn= in any link
  const profileUrnLinks = document.querySelectorAll('a[href*="profileUrn="]');
  for (const link of profileUrnLinks) {
    const href = link.getAttribute("href") || "";
    const match = href.match(/profileUrn=urn%3Ali%3Afsd_profile%3A([^&]+)/);
    if (match?.[1]) {
      return match[1];
    }
  }

  // Strategy 4: Look in data attributes that might contain the profile URN
  const elementsWithUrn = document.querySelectorAll('[data-urn*="fsd_profile"]');
  for (const el of elementsWithUrn) {
    const urn = el.getAttribute("data-urn") || "";
    const match = urn.match(/fsd_profile:([A-Za-z0-9_-]+)/);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

// Extract user data from profile page
function extractProfileData(): LinkedInUser | null {
  const section = document.querySelector("section[data-member-id]");
  if (!section) {
    console.log("[LinkedIn Tag Helper] Could not find profile section");
    return null;
  }

  const memberId = section.getAttribute("data-member-id");
  if (!memberId) {
    console.log("[LinkedIn Tag Helper] Could not find member ID");
    return null;
  }

  const nameElement = section.querySelector("h1");
  if (!nameElement) {
    console.log("[LinkedIn Tag Helper] Could not find name element");
    return null;
  }
  const displayName = nameElement.textContent?.trim() || "";

  const entityUrn = extractEntityUrn();
  if (!entityUrn) {
    console.log("[LinkedIn Tag Helper] Could not extract entity URN from any source");
    return null;
  }

  return {
    type: "user" as const,
    entityUrn,
    memberId,
    displayName,
  };
}

// Extract company/school ID from various sources on the page
function extractOrgId(): string | null {
  const companyLinks = document.querySelectorAll('a[href*="currentCompany="]');
  for (const link of companyLinks) {
    const href = link.getAttribute("href") || "";
    const match = href.match(/currentCompany=%5B%22(\d+)%22%5D/);
    if (match?.[1]) {
      return match[1];
    }
  }

  const schoolLinks = document.querySelectorAll('a[href*="schoolFilter="]');
  for (const link of schoolLinks) {
    const href = link.getAttribute("href") || "";
    const match = href.match(/schoolFilter=%5B%22(\d+)%22%5D/);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

function isOrgPage(): boolean {
  return window.location.pathname.startsWith("/company/") || 
         window.location.pathname.startsWith("/school/");
}

function extractOrgData(): LinkedInOrg | null {
  const companySection = document.querySelector("section.org-top-card");
  if (!companySection) {
    console.log("[LinkedIn Tag Helper] Could not find org section");
    return null;
  }

  const nameElement = companySection.querySelector("h1");
  if (!nameElement) {
    console.log("[LinkedIn Tag Helper] Could not find org name element");
    return null;
  }
  const displayName = nameElement.textContent?.trim() || "";

  const pathMatch = window.location.pathname.match(/\/(company|school)\/([^/]+)/);
  if (!pathMatch?.[2]) {
    console.log("[LinkedIn Tag Helper] Could not extract org universal name from URL");
    return null;
  }
  const universalName = pathMatch[2];

  const companyId = extractOrgId();
  if (!companyId) {
    console.log("[LinkedIn Tag Helper] Could not extract org ID");
    return null;
  }

  return {
    type: "org" as const,
    companyId,
    universalName,
    displayName,
  };
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// Profile/Org page "Add to Tags" button
// ============================================

function createListSelector(): HTMLDivElement {
  const container = document.createElement("div");
  container.className = "linkedin-tag-helper-dropdown";
  container.id = "linkedin-tag-helper-dropdown";
  return container;
}

function getEntityCountFromList(list: TagList): number {
  return list.entities?.length ?? list.users.length;
}

function updateDropdownContent(dropdown: HTMLDivElement, onSelect: (listId: string) => void) {
  const data = getStorageDataSync();
  if (!data) {
    // Cache not ready yet - will be populated when ready
    return;
  }
  
  const { lists, selectedListId } = data;
  
  dropdown.innerHTML = lists
    .map((list) => `
      <button class="linkedin-tag-helper-dropdown-item ${list.id === selectedListId ? 'selected' : ''}" data-list-id="${list.id}">
        ${escapeHtml(list.name)} (${getEntityCountFromList(list)})
      </button>
    `)
    .join("");
  
  dropdown.querySelectorAll(".linkedin-tag-helper-dropdown-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const listId = (btn as HTMLButtonElement).dataset.listId;
      if (listId) {
        onSelect(listId);
      }
    });
  });
}

function createAddButton(): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.className = "linkedin-tag-helper-wrapper";
  wrapper.id = "linkedin-tag-helper-wrapper";

  const button = document.createElement("button");
  button.id = "linkedin-tag-helper-add-btn";
  button.className = "linkedin-tag-helper-btn";
  button.title = "Add to tag list";

  const dropdown = createListSelector();

  // Handler for list selection
  const onSelectList = async (listId: string) => {
    await addEntityToList(listId, button);
    hideDropdown(dropdown);
  };

  // Sync function to refresh dropdown from cache
  const refreshDropdown = () => {
    updateDropdownContent(dropdown, onSelectList);
  };

  // Initial setup - cache should already be loaded from init()
  updateButtonText(button);
  refreshDropdown();

  // Refresh on hover in case data changed
  button.addEventListener("mouseenter", refreshDropdown);

  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropdown.classList.contains("show")) {
      hideDropdown(dropdown);
    } else {
      // Refresh dropdown content right before showing (sync, uses cache)
      refreshDropdown();
      showDropdown(dropdown);
    }
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target as Node)) {
      hideDropdown(dropdown);
    }
  });

  wrapper.appendChild(button);
  wrapper.appendChild(dropdown);

  return wrapper;
}

function getEntityId(entity: LinkedInEntity): string {
  if (isLinkedInUser(entity)) {
    return `user:${entity.memberId}`;
  } else {
    return `org:${entity.companyId}`;
  }
}

function entityExistsInList(list: TagList, entity: LinkedInEntity): boolean {
  const entityId = getEntityId(entity);
  const entities = list.entities ?? list.users.map((u) => ({ ...u, type: "user" as const }));
  return entities.some((e) => getEntityId(e) === entityId);
}

function updateButtonText(button: HTMLButtonElement) {
  const data = getStorageDataSync();
  if (!data) {
    // Cache not ready yet - show default text
    button.innerHTML = `+ Tag <span class="linkedin-tag-helper-list-name">General</span>`;
    return;
  }
  
  const { lists, selectedListId } = data;
  const selectedList = lists.find((l) => l.id === selectedListId);
  const listName = selectedList?.name || "General";
  
  const entityData = getCurrentEntityData();
  if (entityData) {
    const entityInLists = lists.filter((l) => entityExistsInList(l, entityData));
    
    if (entityInLists.length > 0) {
      button.textContent = `Added (${entityInLists.length})`;
      button.classList.add("added");
      button.title = `In: ${entityInLists.map(l => l.name).join(", ")}`;
    } else {
      button.innerHTML = `+ Tag <span class="linkedin-tag-helper-list-name">${escapeHtml(listName)}</span>`;
      button.classList.remove("added");
      button.title = `Add to ${listName}`;
    }
  } else {
    button.innerHTML = `+ Tag <span class="linkedin-tag-helper-list-name">${escapeHtml(listName)}</span>`;
    button.classList.remove("added");
  }
}

function getCurrentEntityData(): LinkedInEntity | null {
  if (window.location.pathname.startsWith("/in/")) {
    return extractProfileData();
  } else if (isOrgPage()) {
    return extractOrgData();
  }
  return null;
}

function showDropdown(dropdown: HTMLDivElement) {
  dropdown.classList.add("show");
}

function hideDropdown(dropdown: HTMLDivElement) {
  dropdown.classList.remove("show");
}

async function addEntityToList(listId: string, button: HTMLButtonElement) {
  const entityData = getCurrentEntityData();
  if (!entityData) {
    showToast("Could not extract profile/org data", "error");
    return;
  }

  const { lists } = await getStorageData();
  const listIndex = lists.findIndex((l) => l.id === listId);
  
  if (listIndex === -1) {
    showToast("List not found", "error");
    return;
  }

  const list = lists[listIndex];
  if (!list) {
    showToast("List not found", "error");
    return;
  }
  
  if (!list.entities) {
    list.entities = list.users.map((u) => ({ ...u, type: "user" as const }));
  }
  
  if (entityExistsInList(list, entityData)) {
    showToast(`${entityData.displayName} is already in "${list.name}"`, "info");
    return;
  }

  list.entities.push({ ...entityData });
  
  if (isLinkedInUser(entityData)) {
    list.users.push({ ...entityData });
  }
  
  lists[listIndex] = list;
  
  await chrome.storage.local.set({ lists });
  
  // Refresh cache with new data, then update button
  await refreshStorageCache();

  showToast(`Added ${entityData.displayName} to "${list.name}"`, "success");
  updateButtonText(button);
}

function updateButtonState(wrapper: HTMLDivElement) {
  const button = wrapper.querySelector("#linkedin-tag-helper-add-btn") as HTMLButtonElement;
  if (button) {
    updateButtonText(button);
  }
}

function showToast(message: string, type: "success" | "error" | "info") {
  const existingToast = document.querySelector(".linkedin-tag-helper-toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `linkedin-tag-helper-toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Track the current page path to detect SPA navigation
let currentEntityPath: string | null = null;

function injectAddButtonOnProfile() {
  if (!window.location.pathname.startsWith("/in/")) {
    return;
  }

  const nameElement = document.querySelector("section[data-member-id] h1");
  if (!nameElement) {
    return;
  }

  const existingWrapper = document.getElementById("linkedin-tag-helper-wrapper");
  
  // Check if we've navigated to a different page
  if (existingWrapper && currentEntityPath !== window.location.pathname) {
    // Page changed, remove old wrapper to create fresh one
    existingWrapper.remove();
  }

  // Update tracked path
  currentEntityPath = window.location.pathname;

  // Check again after potential removal
  if (document.getElementById("linkedin-tag-helper-wrapper")) {
    // Wrapper exists for current page, just update state
    const wrapper = document.getElementById("linkedin-tag-helper-wrapper") as HTMLDivElement;
    updateButtonState(wrapper);
    return;
  }

  const wrapper = createAddButton();
  
  // Find the network degree indicator (e.g., "1st", "2nd", "3rd") to insert after it
  // This is typically a span with class containing "distance-badge" or similar
  const profileSection = nameElement.closest("section[data-member-id]");
  const degreeIndicator = profileSection?.querySelector(
    'span.dist-value, span[class*="distance"], .distance-badge, span.artdeco-badge'
  );
  
  if (degreeIndicator) {
    // Insert after the degree indicator (e.g., "2nd")
    degreeIndicator.insertAdjacentElement("afterend", wrapper);
  } else {
    // Fallback: look for the container that holds name + degree
    const nameContainer = nameElement.parentElement;
    if (nameContainer) {
      // Append to the end of the name container row
      nameContainer.insertAdjacentElement("beforeend", wrapper);
    } else {
      // Last resort: insert after the name element itself
      nameElement.insertAdjacentElement("afterend", wrapper);
    }
  }

  updateButtonState(wrapper);
}

function injectAddButtonOnOrg() {
  if (!isOrgPage()) {
    return;
  }

  const nameElement = document.querySelector("section.org-top-card h1");
  if (!nameElement) {
    return;
  }

  const existingWrapper = document.getElementById("linkedin-tag-helper-wrapper");
  
  // Check if we've navigated to a different page
  if (existingWrapper && currentEntityPath !== window.location.pathname) {
    // Page changed, remove old wrapper to create fresh one
    existingWrapper.remove();
  }

  // Update tracked path
  currentEntityPath = window.location.pathname;

  // Check again after potential removal
  if (document.getElementById("linkedin-tag-helper-wrapper")) {
    // Wrapper exists for current page, just update state
    const wrapper = document.getElementById("linkedin-tag-helper-wrapper") as HTMLDivElement;
    updateButtonState(wrapper);
    return;
  }

  const wrapper = createAddButton();
  nameElement.insertAdjacentElement("afterend", wrapper);
  updateButtonState(wrapper);
}

function injectAddButton() {
  injectAddButtonOnProfile();
  injectAddButtonOnOrg();
}

// ============================================
// Tag insertion into editor
// ============================================

// Helper function to truncate name based on word limit
function truncateName(fullName: string, wordLimit: number): string {
  if (wordLimit === 0) return fullName; // 0 means no limit

  const words = fullName.trim().split(/\s+/);
  return words.slice(0, wordLimit).join(" ");
}

// Get global settings
async function getGlobalSettings(): Promise<Settings> {
  const storage = await chrome.storage.local.get("settings");
  return storage.settings || DEFAULT_SETTINGS;
}

async function createUserTagHtml(user: LinkedInUser): Promise<string> {
  const settings = await getGlobalSettings();
  const displayName = truncateName(user.displayName, settings.nameWordLimit);

  // Don't use LinkedIn's URNs - use plain text mention instead
  // This prevents LinkedIn from fetching and replacing with full name
  return `<strong>${displayName}</strong>`;
}

async function createOrgTagHtml(org: LinkedInOrg): Promise<string> {
  const settings = await getGlobalSettings();

  // Only truncate org names if the setting is enabled
  const displayName = settings.truncateOrgNames
    ? truncateName(org.displayName, settings.nameWordLimit)
    : org.displayName;

  // Don't use LinkedIn's URNs - use plain text mention instead
  // This prevents LinkedIn from fetching and replacing with full name
  return `<strong>${displayName}</strong>`;
}

async function createEntityTagHtml(entity: LinkedInEntity): Promise<string> {
  if (isLinkedInUser(entity)) {
    return await createUserTagHtml(entity);
  } else {
    return await createOrgTagHtml(entity);
  }
}

// Find the editor element in the page
function findEditor(): HTMLElement | null {
  // Try multiple selectors for the editor (including modal dialogs)
  const editorSelectors = [
    // Direct ql-editor with contenteditable
    '.ql-editor[contenteditable="true"]',
    // Inside editor-content container
    '.editor-content .ql-editor[contenteditable="true"]',
    // Inside ql-container
    '.ql-container .ql-editor[contenteditable="true"]',
    // Inside dialogs
    '[role="dialog"] .ql-editor[contenteditable="true"]',
    // Share box
    '.share-box .ql-editor[contenteditable="true"]',
    // Editor container
    '.editor-container .ql-editor[contenteditable="true"]',
    // Any contenteditable with ql-editor class
    'div.ql-editor[contenteditable="true"]',
  ];

  for (const selector of editorSelectors) {
    const editor = document.querySelector(selector) as HTMLElement | null;
    if (editor) {
      return editor;
    }
  }

  return null;
}

// Insert tags into the post editor (legacy function for backward compatibility)
async function insertTagsIntoEditor(users: LinkedInUser[]) {
  const entities: LinkedInEntity[] = users.map((u) => ({ ...u, type: "user" as const }));
  await insertEntitiesIntoEditor(entities);
}

// Insert entities (users + orgs) into the post editor
async function insertEntitiesIntoEditor(entities: LinkedInEntity[]) {
  const editor = findEditor();

  if (!editor) {
    showToast("Could not find post editor. Please open a new post first.", "error");
    return;
  }

  // Create the HTML for all tags, comma-separated
  const tagsHtmlArray = await Promise.all(
    entities.map((e) => createEntityTagHtml(e))
  );
  const tagsHtml = tagsHtmlArray.join(", ");

  // Get or create paragraph
  let paragraph = editor.querySelector("p");
  if (!paragraph) {
    paragraph = document.createElement("p");
    editor.appendChild(paragraph);
  }

  // Append to existing content
  const existingContent = paragraph.innerHTML;
  const separator = existingContent && existingContent !== "<br>" ? " " : "";
  paragraph.innerHTML = existingContent.replace("<br>", "") + separator + tagsHtml;

  // Remove blank class if present
  editor.classList.remove("ql-blank");

  // Trigger input event so LinkedIn recognizes the change
  editor.dispatchEvent(new Event("input", { bubbles: true }));
  editor.focus();

  showToast(`Inserted ${entities.length} tag(s)`, "success");
}

// ============================================
// In-page Insert Tags Widget (in post editor)
// ============================================

function createEditorInsertWidget(): HTMLDivElement {
  const widget = document.createElement("div");
  widget.className = "linkedin-tag-helper-editor-widget";
  widget.id = "linkedin-tag-helper-editor-widget";

  // Stop all events from bubbling up to LinkedIn's elements
  const stopPropagation = (e: Event) => {
    e.stopPropagation();
  };

  // Prevent events from reaching LinkedIn's emoji button
  widget.addEventListener("click", stopPropagation);
  widget.addEventListener("mousedown", stopPropagation);
  widget.addEventListener("mouseup", stopPropagation);
  widget.addEventListener("pointerdown", stopPropagation);
  widget.addEventListener("pointerup", stopPropagation);

  // Main button - styled to match LinkedIn's native artdeco buttons exactly
  const mainBtn = document.createElement("button");
  // Use LinkedIn's actual button classes for perfect match
  mainBtn.className = "linkedin-tag-helper-editor-btn artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary";
  mainBtn.type = "button";
  mainBtn.title = "Insert tags from list";
  mainBtn.setAttribute("aria-label", "Insert tags from list");
  // Using LinkedIn-style SVG structure (24x24)
  mainBtn.innerHTML = `
    <svg role="none" aria-hidden="true" class="artdeco-button__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 14H9a5 5 0 00-5 5v2h16v-2a5 5 0 00-5-5zM12 12a4 4 0 100-8 4 4 0 000 8z"></path>
    </svg>
    <span class="artdeco-button__text">Insert tags from list</span>
  `;

  // Dropdown panel
  const dropdown = document.createElement("div");
  dropdown.className = "linkedin-tag-helper-editor-dropdown";

  // Header with list selector
  const header = document.createElement("div");
  header.className = "linkedin-tag-helper-editor-dropdown-header";
  
  const listSelect = document.createElement("select");
  listSelect.className = "linkedin-tag-helper-editor-select";
  listSelect.id = "linkedin-tag-helper-editor-select";

  header.appendChild(listSelect);
  dropdown.appendChild(header);

  // User list
  const userList = document.createElement("div");
  userList.className = "linkedin-tag-helper-editor-userlist";
  userList.id = "linkedin-tag-helper-editor-userlist";
  dropdown.appendChild(userList);

  // Insert button
  const insertBtn = document.createElement("button");
  insertBtn.className = "linkedin-tag-helper-editor-insert-btn";
  insertBtn.textContent = "Insert Tags";
  insertBtn.id = "linkedin-tag-helper-editor-insert-btn";
  dropdown.appendChild(insertBtn);

  widget.appendChild(mainBtn);
  widget.appendChild(dropdown);

  // Event handlers
  mainBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
    } else {
      await updateEditorWidgetDropdown(listSelect, userList, insertBtn);
      dropdown.classList.add("show");
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!widget.contains(e.target as Node)) {
      dropdown.classList.remove("show");
    }
  });

  // List selection change - stop propagation on all events
  listSelect.addEventListener("click", stopPropagation);
  listSelect.addEventListener("mousedown", stopPropagation);
  listSelect.addEventListener("focus", stopPropagation);
  listSelect.addEventListener("change", async (e) => {
    e.stopPropagation();
    const selectedListId = listSelect.value;
    await chrome.storage.local.set({ selectedListId });
    await updateEditorWidgetUserList(userList, insertBtn);
  });

  // Insert button click
  insertBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { lists, selectedListId } = await getStorageData();
    const currentList = lists.find((l) => l.id === selectedListId);
    const entities = getEntitiesFromList(currentList);
    
    if (entities.length === 0) {
      showToast("No tags in this list", "error");
      return;
    }

    await insertEntitiesIntoEditor(entities);
    dropdown.classList.remove("show");
  });

  return widget;
}

async function updateEditorWidgetDropdown(
  listSelect: HTMLSelectElement, 
  userList: HTMLDivElement,
  insertBtn: HTMLButtonElement
) {
  const { lists, selectedListId } = await getStorageData();
  
  // Update list selector
  listSelect.innerHTML = lists
    .map((list) => `<option value="${list.id}" ${list.id === selectedListId ? 'selected' : ''}>${escapeHtml(list.name)} (${getEntitiesFromList(list).length})</option>`)
    .join("");
  
  // Update user list
  await updateEditorWidgetUserList(userList, insertBtn);
}

function getEntitiesFromList(list: TagList | undefined): LinkedInEntity[] {
  if (!list) return [];
  return list.entities ?? list.users.map((u) => ({ ...u, type: "user" as const }));
}

async function updateEditorWidgetUserList(userList: HTMLDivElement, insertBtn: HTMLButtonElement) {
  const { lists, selectedListId } = await getStorageData();
  const currentList = lists.find((l) => l.id === selectedListId);
  const entities = getEntitiesFromList(currentList);
  
  insertBtn.disabled = entities.length === 0;
  
  if (entities.length === 0) {
    userList.innerHTML = `<div class="linkedin-tag-helper-editor-empty">No tags in this list</div>`;
    return;
  }
  
  userList.innerHTML = entities
    .map((entity) => `
      <div class="linkedin-tag-helper-editor-user">
        <span class="linkedin-tag-helper-editor-user-name">${escapeHtml(entity.displayName)}</span>
        <span class="linkedin-tag-helper-editor-user-type">${entity.type === "user" ? "User" : "Org"}</span>
      </div>
    `)
    .join("");
}

// Find the emoji button to inject widget next to it
function findEmojiButton(): HTMLElement | null {
  // Look for emoji button by various attributes
  const emojiSelectors = [
    // Case-insensitive aria-label matching
    'button[aria-label*="emoji" i]',
    'button[aria-label*="Emoji"]',
    // Test ID
    'button[data-test-id="emoji-button"]',
    // Look inside dialogs specifically
    '[role="dialog"] button[aria-label*="emoji" i]',
    '[role="dialog"] button[aria-label*="Emoji"]',
    // Spanish/other language labels
    'button[aria-label*="emoticon" i]',
    'button[aria-label*="emoticono" i]',
  ];

  for (const selector of emojiSelectors) {
    const btn = document.querySelector(selector) as HTMLElement | null;
    if (btn) {
      return btn;
    }
  }

  return null;
}

// Find the editor toolbar to inject widget into
function findEditorToolbar(): HTMLElement | null {
  // Look for the toolbar container near the editor
  const toolbarSelectors = [
    // Share box toolbar
    '.share-creation-state__footer',
    '.share-box_actions',
    // Editor footer/toolbar  
    '[role="dialog"] .editor-footer',
    '[role="dialog"] .share-creation-state__footer',
    // Generic toolbar near editor
    '.ql-editor-toolbar',
    '.editor-toolbar',
  ];

  for (const selector of toolbarSelectors) {
    const toolbar = document.querySelector(selector) as HTMLElement | null;
    if (toolbar) {
      return toolbar;
    }
  }

  return null;
}

// Inject widget into post editor dialog
function injectEditorWidget() {
  // Check if widget already exists
  if (document.getElementById("linkedin-tag-helper-editor-widget")) {
    return;
  }

  // Check if there's an editor on the page
  const editor = findEditor();
  if (!editor) {
    return;
  }

  const widget = createEditorInsertWidget();

  // Strategy 1: Find the emoji button and wrap both in a horizontal container
  const emojiButton = findEmojiButton();
  if (emojiButton) {
    // Create a wrapper to hold both buttons horizontally
    const wrapper = document.createElement("div");
    wrapper.id = "linkedin-tag-helper-emoji-wrapper";
    wrapper.style.cssText = "display: flex; flex-direction: row; align-items: center; gap: 0;";
    
    // Insert wrapper where emoji button is
    emojiButton.parentElement?.insertBefore(wrapper, emojiButton);
    
    // Move emoji button into wrapper
    wrapper.appendChild(emojiButton);
    
    // Add our widget next to it
    wrapper.appendChild(widget);
    return;
  }

  // Strategy 2: Find the editor toolbar and append to it
  const toolbar = findEditorToolbar();
  if (toolbar) {
    toolbar.insertAdjacentElement("beforeend", widget);
    return;
  }

  // Strategy 3: Find any button row near the editor and append
  const dialog = editor.closest('[role="dialog"]');
  if (dialog) {
    // Look for button containers in the dialog
    const buttonContainers = dialog.querySelectorAll('div[class*="footer"], div[class*="actions"], div[class*="toolbar"]');
    for (const container of buttonContainers) {
      // Find a good spot - look for a row with buttons
      const buttons = container.querySelectorAll('button');
      if (buttons.length > 0) {
        container.insertAdjacentElement("beforeend", widget);
        return;
      }
    }
  }

  // Strategy 4: Place near the editor itself as last resort
  const editorContainer = editor.closest('.ql-container') || editor.parentElement;
  if (editorContainer) {
    editorContainer.insertAdjacentElement("afterend", widget);
  }
}

// Remove widget when editor closes
function removeEditorWidget() {
  const widget = document.getElementById("linkedin-tag-helper-editor-widget");
  const wrapper = document.getElementById("linkedin-tag-helper-emoji-wrapper");
  
  // Check if editor still exists
  const editor = findEditor();
  if (!editor) {
    // Unwrap emoji button if we wrapped it
    if (wrapper) {
      const emojiButton = wrapper.querySelector('button[aria-label*="emoji" i], button[aria-label*="Emoji"]');
      if (emojiButton && wrapper.parentElement) {
        wrapper.parentElement.insertBefore(emojiButton, wrapper);
      }
      wrapper.remove();
    }
    
    if (widget) {
      widget.remove();
    }
  }
}

// ============================================
// Message listener
// ============================================

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    if (message.type === "insertTags") {
      // Use entities if available, otherwise fall back to users
      if (message.entities && message.entities.length > 0) {
        insertEntitiesIntoEditor(message.entities);
      } else {
        insertTagsIntoEditor(message.users);
      }
      sendResponse({ success: true });
    }
    return true;
  }
);

// ============================================
// Initialization
// ============================================

// Guard flag to prevent concurrent injection attempts
let isInjecting = false;

function handleDOMChanges() {
  // Prevent re-entry
  if (isInjecting) {
    return;
  }
  
  // Skip if cache not ready yet
  if (!getStorageDataSync()) {
    return;
  }
  
  isInjecting = true;
  try {
    injectAddButton();
    injectEditorWidget();
    removeEditorWidget();
  } finally {
    isInjecting = false;
  }
}

// Debounced version - waits 200ms after last DOM change before running
const debouncedHandleDOMChanges = debounce(handleDOMChanges, 200);

function init() {
  // Listen for storage changes - just invalidate cache (lazy reload on next access)
  chrome.storage.onChanged.addListener(() => {
    invalidateStorageCache();
  });

  // Preload storage data, then inject UI
  loadStorageData().then(() => {
    handleDOMChanges();
  });

  // Observer for SPA navigation and editor dialogs (debounced)
  const observer = new MutationObserver(debouncedHandleDOMChanges);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
