import type { LinkedInUser, LinkedInOrg, LinkedInEntity, InsertTagsMessage, TagList, StorageData } from "../types";
import { DEFAULT_LIST_ID } from "../types";

// Type guard functions
function isLinkedInUser(entity: LinkedInEntity): entity is LinkedInUser {
  return entity.type === "user";
}

function isLinkedInOrg(entity: LinkedInEntity): entity is LinkedInOrg {
  return entity.type === "org";
}

// Get entity unique identifier for comparison
function getEntityId(entity: LinkedInEntity): string {
  if (isLinkedInUser(entity)) {
    return `user:${entity.memberId}`;
  } else {
    return `org:${entity.companyId}`;
  }
}

// Get entity display ID
function getEntityDisplayId(entity: LinkedInEntity): string {
  if (isLinkedInUser(entity)) {
    return entity.memberId;
  } else {
    return entity.universalName;
  }
}

// Get entity type label
function getEntityTypeLabel(entity: LinkedInEntity): string {
  return isLinkedInUser(entity) ? "User" : "Org";
}

// DOM Elements
const userListEl = document.getElementById("user-list") as HTMLUListElement;
const countEl = document.getElementById("count") as HTMLSpanElement;
const insertBtn = document.getElementById("insert-btn") as HTMLButtonElement;
const clearBtn = document.getElementById("clear-btn") as HTMLButtonElement;
const listSelectEl = document.getElementById("list-select") as HTMLSelectElement;
const addListBtn = document.getElementById("add-list-btn") as HTMLButtonElement;
const manageListsBtn = document.getElementById("manage-lists-btn") as HTMLButtonElement;
const listManagementEl = document.getElementById("list-management") as HTMLDivElement;
const closeManagementBtn = document.getElementById("close-management-btn") as HTMLButtonElement;
const listsListEl = document.getElementById("lists-list") as HTMLUListElement;
const contextMenuEl = document.getElementById("user-context-menu") as HTMLDivElement;
const listPickerModal = document.getElementById("list-picker-modal") as HTMLDivElement;
const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement;
const modalListOptions = document.getElementById("modal-list-options") as HTMLUListElement;
const closeModalBtn = document.getElementById("close-modal-btn") as HTMLButtonElement;
const listFormModal = document.getElementById("list-form-modal") as HTMLDivElement;
const listFormTitle = document.getElementById("list-form-title") as HTMLHeadingElement;
const listForm = document.getElementById("list-form") as HTMLFormElement;
const listNameInput = document.getElementById("list-name-input") as HTMLInputElement;
const closeFormModalBtn = document.getElementById("close-form-modal-btn") as HTMLButtonElement;
const cancelFormBtn = document.getElementById("cancel-form-btn") as HTMLButtonElement;

// State
let currentListId: string = DEFAULT_LIST_ID;
let contextMenuUserIndex: number | null = null;
let pendingAction: "copy" | "move" | null = null;
let editingListId: string | null = null;
let draggedIndex: number | null = null;

// Migrate legacy storage format to new format
async function migrateStorageIfNeeded(): Promise<void> {
  const storage = await chrome.storage.local.get(["lists", "users", "selectedListId"]);
  
  if (storage.lists) {
    return;
  }
  
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
    
    await chrome.storage.local.remove("users");
  } else {
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
}

// Get storage data
async function getStorageData(): Promise<StorageData> {
  await migrateStorageIfNeeded();
  const storage = await chrome.storage.local.get(["lists", "selectedListId"]);
  return {
    lists: storage.lists || [],
    selectedListId: storage.selectedListId || DEFAULT_LIST_ID,
  };
}

// Get current list
async function getCurrentList(): Promise<TagList | undefined> {
  const { lists } = await getStorageData();
  return lists.find((l) => l.id === currentListId);
}

// Get entities from a list, with fallback to users for backward compatibility
function getListEntities(list: TagList | undefined): LinkedInEntity[] {
  if (!list) return [];
  if (list.entities && list.entities.length > 0) {
    return list.entities;
  }
  // Fallback to users array for backward compatibility
  return list.users.map((u) => ({ ...u, type: "user" as const }));
}

// Load and render entities for current list
async function loadAndRender(): Promise<void> {
  const { lists, selectedListId } = await getStorageData();
  currentListId = selectedListId;
  
  // Update list selector
  renderListSelector(lists);
  
  // Get current list entities
  const currentList = lists.find((l) => l.id === currentListId);
  const entities = getListEntities(currentList);
  
  renderEntities(entities);
}

function renderListSelector(lists: TagList[]) {
  listSelectEl.innerHTML = lists
    .map((list) => {
      const count = list.entities?.length ?? list.users.length;
      return `<option value="${list.id}" ${list.id === currentListId ? 'selected' : ''}>${escapeHtml(list.name)} (${count})</option>`;
    })
    .join("");
}

function renderEntities(entities: LinkedInEntity[]) {
  countEl.textContent = String(entities.length);
  insertBtn.disabled = entities.length === 0;

  if (entities.length === 0) {
    userListEl.innerHTML = `
      <li class="empty-state">
        No users or orgs in this list. Visit a LinkedIn profile or company page and click "+ Tag" to add them.
      </li>
    `;
    return;
  }

  userListEl.innerHTML = entities
    .map(
      (entity, index) => `
      <li draggable="true" data-index="${index}">
        <span class="drag-handle">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="2"></circle>
            <circle cx="15" cy="6" r="2"></circle>
            <circle cx="9" cy="12" r="2"></circle>
            <circle cx="15" cy="12" r="2"></circle>
            <circle cx="9" cy="18" r="2"></circle>
            <circle cx="15" cy="18" r="2"></circle>
          </svg>
        </span>
        <div class="user-info">
          <span class="user-name">${escapeHtml(entity.displayName)}</span>
          <span class="user-id">${escapeHtml(getEntityDisplayId(entity))} <span class="entity-type">(${getEntityTypeLabel(entity)})</span></span>
        </div>
        <div class="user-actions">
          <button class="more-btn" data-index="${index}" title="More actions">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="6" r="2"></circle>
              <circle cx="12" cy="12" r="2"></circle>
              <circle cx="12" cy="18" r="2"></circle>
            </svg>
          </button>
          <button class="delete-btn" data-index="${index}" title="Remove">x</button>
        </div>
      </li>
    `
    )
    .join("");

  // Add event listeners
  setupUserListEvents();
}

function setupUserListEvents() {
  // Delete handlers
  userListEl.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const target = e.currentTarget as HTMLButtonElement;
      const index = parseInt(target.dataset.index || "0", 10);
      await deleteUser(index);
    });
  });

  // More button handlers (context menu)
  userListEl.querySelectorAll(".more-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const target = e.currentTarget as HTMLButtonElement;
      const index = parseInt(target.dataset.index || "0", 10);
      showContextMenu(e as MouseEvent, index);
    });
  });

  // Drag and drop handlers
  userListEl.querySelectorAll("li[draggable]").forEach((li) => {
    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragend", handleDragEnd);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("dragleave", handleDragLeave);
    li.addEventListener("drop", handleDrop);
  });
}

// Drag and Drop
function handleDragStart(e: Event) {
  const dragEvent = e as DragEvent;
  const target = dragEvent.target as HTMLLIElement;
  draggedIndex = parseInt(target.dataset.index || "0", 10);
  target.classList.add("dragging");
  
  if (dragEvent.dataTransfer) {
    dragEvent.dataTransfer.effectAllowed = "move";
  }
}

function handleDragEnd(e: Event) {
  const target = e.target as HTMLLIElement;
  target.classList.remove("dragging");
  draggedIndex = null;
  
  // Remove all drag-over classes
  userListEl.querySelectorAll(".drag-over").forEach((el) => {
    el.classList.remove("drag-over");
  });
}

function handleDragOver(e: Event) {
  e.preventDefault();
  const dragEvent = e as DragEvent;
  const target = (dragEvent.target as HTMLElement).closest("li") as HTMLLIElement;
  
  if (target && draggedIndex !== null) {
    const targetIndex = parseInt(target.dataset.index || "0", 10);
    if (targetIndex !== draggedIndex) {
      target.classList.add("drag-over");
    }
  }
}

function handleDragLeave(e: Event) {
  const target = (e.target as HTMLElement).closest("li") as HTMLLIElement;
  if (target) {
    target.classList.remove("drag-over");
  }
}

async function handleDrop(e: Event) {
  e.preventDefault();
  const dragEvent = e as DragEvent;
  const target = (dragEvent.target as HTMLElement).closest("li") as HTMLLIElement;
  
  if (target && draggedIndex !== null) {
    const targetIndex = parseInt(target.dataset.index || "0", 10);
    target.classList.remove("drag-over");
    
    if (targetIndex !== draggedIndex) {
      await reorderUsers(draggedIndex, targetIndex);
    }
  }
}

async function reorderUsers(fromIndex: number, toIndex: number) {
  const { lists } = await getStorageData();
  const listIndex = lists.findIndex((l) => l.id === currentListId);
  
  if (listIndex === -1) return;
  
  const list = lists[listIndex];
  if (!list) return;
  
  // Work with entities array
  const entities = [...(list.entities ?? list.users.map((u) => ({ ...u, type: "user" as const })))];
  const [movedEntity] = entities.splice(fromIndex, 1);
  if (movedEntity) {
    entities.splice(toIndex, 0, movedEntity);
    list.entities = entities;
    // Also update users array for backward compatibility
    list.users = entities.filter(isLinkedInUser);
    lists[listIndex] = list;
    
    await chrome.storage.local.set({ lists });
    renderEntities(entities);
  }
}

// Context Menu
function showContextMenu(e: MouseEvent, userIndex: number) {
  contextMenuUserIndex = userIndex;
  
  // Position menu
  const rect = (e.target as HTMLElement).getBoundingClientRect();
  contextMenuEl.style.top = `${rect.bottom + 4}px`;
  contextMenuEl.style.left = `${Math.min(rect.left, window.innerWidth - 180)}px`;
  contextMenuEl.classList.remove("hidden");
  
  // Close on outside click
  setTimeout(() => {
    document.addEventListener("click", closeContextMenu);
  }, 0);
}

function closeContextMenu() {
  contextMenuEl.classList.add("hidden");
  document.removeEventListener("click", closeContextMenu);
}

// Context menu actions
contextMenuEl.querySelectorAll(".context-menu-item").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const action = (e.currentTarget as HTMLButtonElement).dataset.action;
    
    if (action === "delete" && contextMenuUserIndex !== null) {
      await deleteUser(contextMenuUserIndex);
    } else if (action === "copy" || action === "move") {
      pendingAction = action;
      showListPickerModal(action === "copy" ? "Copy to list" : "Move to list");
    }
    
    closeContextMenu();
  });
});

// List Picker Modal
function showListPickerModal(title: string) {
  modalTitle.textContent = title;
  
  getStorageData().then(({ lists }) => {
    modalListOptions.innerHTML = lists
      .map((list) => {
        const isCurrent = list.id === currentListId;
        const count = list.entities?.length ?? list.users.length;
        return `<li data-list-id="${list.id}" class="${isCurrent ? 'disabled' : ''}">${escapeHtml(list.name)} (${count})${isCurrent ? ' (current)' : ''}</li>`;
      })
      .join("");
    
    modalListOptions.querySelectorAll("li:not(.disabled)").forEach((li) => {
      li.addEventListener("click", async () => {
        const targetListId = (li as HTMLLIElement).dataset.listId;
        if (targetListId && contextMenuUserIndex !== null) {
          if (pendingAction === "copy") {
            await copyUserToList(contextMenuUserIndex, targetListId);
          } else if (pendingAction === "move") {
            await moveUserToList(contextMenuUserIndex, targetListId);
          }
        }
        closeListPickerModal();
      });
    });
  });
  
  listPickerModal.classList.remove("hidden");
}

function closeListPickerModal() {
  listPickerModal.classList.add("hidden");
  pendingAction = null;
  contextMenuUserIndex = null;
}

closeModalBtn.addEventListener("click", closeListPickerModal);
listPickerModal.addEventListener("click", (e) => {
  if (e.target === listPickerModal) {
    closeListPickerModal();
  }
});

// Copy/Move operations
async function copyUserToList(entityIndex: number, targetListId: string) {
  const { lists } = await getStorageData();
  const sourceList = lists.find((l) => l.id === currentListId);
  const targetList = lists.find((l) => l.id === targetListId);
  
  if (!sourceList || !targetList) return;
  
  const sourceEntities = sourceList.entities ?? sourceList.users.map((u) => ({ ...u, type: "user" as const }));
  const entity = sourceEntities[entityIndex];
  if (!entity) return;
  
  // Initialize target entities if needed
  if (!targetList.entities) {
    targetList.entities = targetList.users.map((u) => ({ ...u, type: "user" as const }));
  }
  
  // Check if entity already exists in target list
  const entityId = getEntityId(entity);
  const exists = targetList.entities.some((e) => getEntityId(e) === entityId);
  if (exists) {
    showStatus(`${entity.displayName} is already in "${targetList.name}"`, "error");
    return;
  }
  
  // Copy entity (create new object)
  targetList.entities.push({ ...entity });
  // Also update users array for backward compatibility
  if (isLinkedInUser(entity)) {
    targetList.users.push({ ...entity });
  }
  
  await chrome.storage.local.set({ lists });
  showStatus(`Copied ${entity.displayName} to "${targetList.name}"`, "success");
  
  // Update list selector to show new count
  renderListSelector(lists);
}

async function moveUserToList(entityIndex: number, targetListId: string) {
  const { lists } = await getStorageData();
  const sourceListIndex = lists.findIndex((l) => l.id === currentListId);
  const targetListIndex = lists.findIndex((l) => l.id === targetListId);
  
  if (sourceListIndex === -1 || targetListIndex === -1) return;
  
  const sourceList = lists[sourceListIndex];
  const targetList = lists[targetListIndex];
  
  if (!sourceList || !targetList) return;
  
  // Initialize entities arrays if needed
  if (!sourceList.entities) {
    sourceList.entities = sourceList.users.map((u) => ({ ...u, type: "user" as const }));
  }
  if (!targetList.entities) {
    targetList.entities = targetList.users.map((u) => ({ ...u, type: "user" as const }));
  }
  
  const entity = sourceList.entities[entityIndex];
  if (!entity) return;
  
  // Check if entity already exists in target list
  const entityId = getEntityId(entity);
  const exists = targetList.entities.some((e) => getEntityId(e) === entityId);
  if (exists) {
    showStatus(`${entity.displayName} is already in "${targetList.name}"`, "error");
    return;
  }
  
  // Remove from source
  sourceList.entities.splice(entityIndex, 1);
  // Also update users array for backward compatibility
  if (isLinkedInUser(entity)) {
    const userIndex = sourceList.users.findIndex((u) => u.memberId === entity.memberId);
    if (userIndex !== -1) {
      sourceList.users.splice(userIndex, 1);
    }
  }
  
  // Add to target (create new object)
  targetList.entities.push({ ...entity });
  if (isLinkedInUser(entity)) {
    targetList.users.push({ ...entity });
  }
  
  lists[sourceListIndex] = sourceList;
  lists[targetListIndex] = targetList;
  
  await chrome.storage.local.set({ lists });
  showStatus(`Moved ${entity.displayName} to "${targetList.name}"`, "success");
  
  // Re-render current list
  renderListSelector(lists);
  renderEntities(sourceList.entities);
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function deleteUser(index: number) {
  const { lists } = await getStorageData();
  const listIndex = lists.findIndex((l) => l.id === currentListId);
  
  if (listIndex === -1) return;
  
  const list = lists[listIndex];
  if (!list) return;
  
  // Initialize entities if needed
  if (!list.entities) {
    list.entities = list.users.map((u) => ({ ...u, type: "user" as const }));
  }
  
  const entity = list.entities[index];
  list.entities.splice(index, 1);
  
  // Also update users array for backward compatibility
  if (entity && isLinkedInUser(entity)) {
    const userIndex = list.users.findIndex((u) => u.memberId === entity.memberId);
    if (userIndex !== -1) {
      list.users.splice(userIndex, 1);
    }
  }
  
  lists[listIndex] = list;
  
  await chrome.storage.local.set({ lists });
  renderListSelector(lists);
  renderEntities(list.entities);
}

async function clearCurrentList() {
  const currentList = await getCurrentList();
  if (!currentList) return;
  
  if (confirm(`Are you sure you want to remove all users and orgs from "${currentList.name}"?`)) {
    const { lists } = await getStorageData();
    const listIndex = lists.findIndex((l) => l.id === currentListId);
    
    if (listIndex === -1) return;
    
    const list = lists[listIndex];
    if (!list) return;
    
    list.users = [];
    list.entities = [];
    lists[listIndex] = list;
    
    await chrome.storage.local.set({ lists });
    renderListSelector(lists);
    renderEntities([]);
  }
}

async function insertTags() {
  const currentList = await getCurrentList();
  // Use entities array for proper order
  const entities = getListEntities(currentList);
  const users = entities.filter(isLinkedInUser);
  
  if (entities.length === 0) return;

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (!tab?.id) {
    showStatus("Could not find active tab", "error");
    return;
  }

  if (!tab.url?.includes("linkedin.com")) {
    showStatus("Please open LinkedIn first", "error");
    return;
  }

  // Send both entities and users for compatibility
  const message: InsertTagsMessage = { type: "insertTags", users, entities };

  try {
    await chrome.tabs.sendMessage(tab.id, message);
    window.close();
  } catch {
    showStatus("Could not insert tags. Make sure the post editor is open.", "error");
  }
}

function showStatus(message: string, type: "success" | "error") {
  const existing = document.querySelector(".status");
  if (existing) existing.remove();

  const status = document.createElement("div");
  status.className = `status ${type}`;
  status.textContent = message;
  document.querySelector("footer")?.insertAdjacentElement("beforebegin", status);

  setTimeout(() => status.remove(), 3000);
}

// List Management
function renderListsManagement(lists: TagList[]) {
  listsListEl.innerHTML = lists
    .map((list) => {
      const count = list.entities?.length ?? list.users.length;
      return `
      <li data-list-id="${list.id}">
        <div class="list-item-info">
          <span class="list-item-name">${escapeHtml(list.name)}</span>
          <span class="list-item-count">${count}</span>
        </div>
        <div class="list-item-actions">
          <button class="edit-list-btn" title="Rename">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          ${list.id !== DEFAULT_LIST_ID ? `
            <button class="delete-list-btn danger" title="Delete list">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          ` : ''}
        </div>
      </li>
    `;
    })
    .join("");
  
  // Add event listeners
  listsListEl.querySelectorAll(".edit-list-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const li = (e.currentTarget as HTMLElement).closest("li");
      const listId = li?.dataset.listId;
      if (listId) {
        const list = lists.find((l) => l.id === listId);
        if (list) {
          showListFormModal("edit", list);
        }
      }
    });
  });
  
  listsListEl.querySelectorAll(".delete-list-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const li = (e.currentTarget as HTMLElement).closest("li");
      const listId = li?.dataset.listId;
      if (listId) {
        await deleteList(listId);
      }
    });
  });
}

async function deleteList(listId: string) {
  if (listId === DEFAULT_LIST_ID) return;
  
  const { lists } = await getStorageData();
  const list = lists.find((l) => l.id === listId);
  
  if (!list) return;
  
  const count = list.entities?.length ?? list.users.length;
  if (!confirm(`Are you sure you want to delete "${list.name}"? This will also delete all ${count} items in it.`)) {
    return;
  }
  
  const newLists = lists.filter((l) => l.id !== listId);
  
  // If we're deleting the current list, switch to default
  let newSelectedId = currentListId;
  if (currentListId === listId) {
    newSelectedId = DEFAULT_LIST_ID;
  }
  
  await chrome.storage.local.set({ lists: newLists, selectedListId: newSelectedId });
  currentListId = newSelectedId;
  
  renderListsManagement(newLists);
  renderListSelector(newLists);
  
  const currentList = newLists.find((l) => l.id === currentListId);
  renderEntities(getListEntities(currentList));
}

// List Form Modal
function showListFormModal(mode: "create" | "edit", list?: TagList) {
  editingListId = mode === "edit" && list ? list.id : null;
  listFormTitle.textContent = mode === "create" ? "Create List" : "Rename List";
  listNameInput.value = list?.name || "";
  listFormModal.classList.remove("hidden");
  listNameInput.focus();
}

function closeListFormModal() {
  listFormModal.classList.add("hidden");
  editingListId = null;
  listNameInput.value = "";
}

closeFormModalBtn.addEventListener("click", closeListFormModal);
cancelFormBtn.addEventListener("click", closeListFormModal);
listFormModal.addEventListener("click", (e) => {
  if (e.target === listFormModal) {
    closeListFormModal();
  }
});

listForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const name = listNameInput.value.trim();
  if (!name) return;
  
  const { lists } = await getStorageData();
  
  if (editingListId) {
    // Edit existing list
    const listIndex = lists.findIndex((l) => l.id === editingListId);
    if (listIndex !== -1) {
      const list = lists[listIndex];
      if (list) {
        list.name = name;
        lists[listIndex] = list;
      }
    }
  } else {
    // Create new list
    const newList: TagList = {
      id: `list_${Date.now()}`,
      name,
      createdAt: Date.now(),
      users: [],
      entities: [],
    };
    lists.push(newList);
    
    // Switch to new list
    currentListId = newList.id;
    await chrome.storage.local.set({ selectedListId: newList.id });
  }
  
  await chrome.storage.local.set({ lists });
  
  renderListsManagement(lists);
  renderListSelector(lists);
  
  const currentList = lists.find((l) => l.id === currentListId);
  renderEntities(getListEntities(currentList));
  
  closeListFormModal();
});

// List selector change
listSelectEl.addEventListener("change", async () => {
  currentListId = listSelectEl.value;
  await chrome.storage.local.set({ selectedListId: currentListId });
  
  const { lists } = await getStorageData();
  const currentList = lists.find((l) => l.id === currentListId);
  renderEntities(getListEntities(currentList));
});

// Toggle list management panel
manageListsBtn.addEventListener("click", async () => {
  const isHidden = listManagementEl.classList.contains("hidden");
  
  if (isHidden) {
    const { lists } = await getStorageData();
    renderListsManagement(lists);
  }
  
  listManagementEl.classList.toggle("hidden");
});

closeManagementBtn.addEventListener("click", () => {
  listManagementEl.classList.add("hidden");
});

// Add new list button
addListBtn.addEventListener("click", () => {
  showListFormModal("create");
});

// Event listeners
insertBtn.addEventListener("click", insertTags);
clearBtn.addEventListener("click", clearCurrentList);

// Initial load
loadAndRender();

// Listen for storage changes to update UI
chrome.storage.onChanged.addListener((changes) => {
  if (changes.lists || changes.selectedListId) {
    loadAndRender();
  }
});
