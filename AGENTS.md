# AGENTS.md - LinkedIn Tag Extension

Chrome Extension (Manifest V3) for quickly tagging multiple LinkedIn users in posts. Built with Bun and TypeScript.

## Project Structure

```
src/
  types.ts           # Shared TypeScript interfaces
  content/           # Content script injected into LinkedIn pages
  popup/             # Extension popup UI
dist/                # Build output (gitignored)
build.ts             # Bun build script
manifest.json        # Chrome extension manifest v3
```

## Commands

```bash
bun install          # Install dependencies
bun run build        # Build extension to ./dist
bun run watch        # Watch mode
bun test             # Run all tests
bun test file.test.ts        # Run single test file
bun test --filter "pattern"  # Run tests matching pattern
```

## Bun-Specific Guidelines

Always use Bun instead of Node.js:
- `bun <file>` instead of `node` or `ts-node`
- `bun install` instead of npm/yarn/pnpm
- Bun auto-loads `.env` files - do not use dotenv

Prefer Bun APIs:
- `Bun.build()` for bundling
- `Bun.$` for shell commands
- `Bun.file()` for file I/O

## TypeScript Configuration

Strict mode enabled:
- `noUncheckedIndexedAccess: true` - Array access returns `T | undefined`
- `verbatimModuleSyntax: true` - Requires `import type` for type-only imports

## Code Style

### Imports
Use `import type` for type-only imports:
```typescript
import type { LinkedInUser, ExtensionMessage } from "../types";
```

### Naming Conventions

| Element      | Convention | Example                   |
|--------------|------------|---------------------------|
| Files        | kebab-case | `content.ts`              |
| Interfaces   | PascalCase | `LinkedInUser`            |
| Functions    | camelCase  | `extractProfileData`      |
| CSS classes  | kebab-case | `linkedin-tag-helper-btn` |

### Types
Use discriminated unions for messages:
```typescript
export interface InsertTagsMessage {
  type: "insertTags";
  users: LinkedInUser[];
}
export type ExtensionMessage = InsertTagsMessage | UserAddedMessage;
```

Use type assertions for DOM queries:
```typescript
const editor = document.querySelector('.ql-editor') as HTMLElement | null;
```

### Error Handling
Use optional chaining for null values:
```typescript
if (match?.[1]) {
  return match[1];
}
```

Try/catch for Chrome API calls with user feedback:
```typescript
try {
  await chrome.tabs.sendMessage(tab.id, message);
} catch {
  showStatus("Could not insert tags", "error");
}
```

### DOM Manipulation
Template literals for HTML generation with escaped content:
```typescript
userListEl.innerHTML = users
  .map((user, index) => `<li>${escapeHtml(user.displayName)}</li>`)
  .join("");

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
```

### Async Patterns
Use `async/await` for Chrome APIs:
```typescript
const storage = await chrome.storage.local.get("users");
const users: LinkedInUser[] = storage.users || [];
```

### CSS Guidelines
- Prefix classes: `linkedin-tag-helper-*`
- Reset: `* { margin: 0; padding: 0; box-sizing: border-box; }`
- LinkedIn colors: blue `#0a66c2`, green `#057642`, red `#cc1016`
- Use transitions: `transition: all 0.15s ease;`

## Chrome Extension Specifics

- Manifest V3 with permissions: `storage`, `activeTab`
- Content scripts run on `*://*.linkedin.com/*`
- Use `chrome.storage.local` for persistence
- Use `chrome.runtime.onMessage` for popup-to-content communication
- Use MutationObserver to handle LinkedIn SPA navigation

## Testing

```typescript
import { test, expect, describe } from "bun:test";

describe("extractEntityUrn", () => {
  test("extracts URN from connectionOf link", () => {
    expect(result).toBe("expected");
  });
});
```

## Build Output

Build outputs to `./dist` with minified JS bundles and static assets.
Load: Chrome > Extensions > Load unpacked > select `./dist`
