export interface LinkedInUser {
  type: "user";
  entityUrn: string; // e.g., "ACoAAC3QO04B_cj1GBS_KpigIvRd-45ynFE6eHM"
  memberId: string; // e.g., "768621390"
  displayName: string; // e.g., "Cristian Correa"
}

export interface LinkedInOrg {
  type: "org";
  companyId: string; // e.g., "109971178" from currentCompany=%5B%22109971178%22%5D
  universalName: string; // e.g., "thehackathoncompany" from URL /company/thehackathoncompany/
  displayName: string; // e.g., "The Hackathon Company"
}

export type LinkedInEntity = LinkedInUser | LinkedInOrg;

// Global settings
export interface Settings {
  nameWordLimit: number; // 0 = no limit (full name), 1+ = number of words to show
}

export const DEFAULT_SETTINGS: Settings = {
  nameWordLimit: 0, // Full name by default
};

export interface TagList {
  id: string;
  name: string;
  createdAt: number;
  users: LinkedInUser[]; // Keep for backward compatibility
  entities?: LinkedInEntity[]; // New unified list (optional for migration)
}

export const DEFAULT_LIST_ID = "default";

export interface StorageData {
  lists: TagList[];
  selectedListId: string;
  settings?: Settings; // Global settings
}

// Legacy storage format for migration
export interface LegacyStorageData {
  users: LinkedInUser[];
}

export type MessageType = "insertTags" | "userAdded" | "getLists";

export interface InsertTagsMessage {
  type: "insertTags";
  users: LinkedInUser[]; // Kept for backward compatibility
  entities?: LinkedInEntity[]; // New unified list (optional)
}

export interface UserAddedMessage {
  type: "userAdded";
  user: LinkedInUser;
  listId: string;
}

export interface GetListsMessage {
  type: "getLists";
}

export interface GetListsResponse {
  lists: TagList[];
  selectedListId: string;
}

export type ExtensionMessage = InsertTagsMessage | UserAddedMessage | GetListsMessage;
