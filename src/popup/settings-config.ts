export interface SettingOption {
  id: string;
  name: string;
  description: string;
  type: "number" | "toggle" | "select" | "text";
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  options?: Array<{ value: any; label: string }>;
}

export interface SettingCategory {
  id: string;
  title: string;
  description?: string;
  settings: SettingOption[];
}

export const SETTINGS_CONFIG: SettingCategory[] = [
  {
    id: "display",
    title: "Display Settings",
    description: "Customize how tags appear in your posts",
    settings: [
      {
        id: "nameWordLimit",
        name: "Name Display Limit",
        description: "0 = Full name, 1 = First word only, 2+ = Number of words",
        type: "number",
        defaultValue: 0,
        min: 0,
        step: 1,
        placeholder: "0",
      },
    ],
  },
  // Future categories can be added here easily
];
