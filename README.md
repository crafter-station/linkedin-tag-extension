# LinkedIn Tag Helper

A Chrome Extension (Manifest V3) for quickly tagging multiple LinkedIn users in posts. Built with Bun and TypeScript.

## Features

- Quickly collect LinkedIn users while browsing
- Insert multiple user tags into LinkedIn posts with one click
- Persistent storage of collected users

## Installation

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- Chrome or Chromium-based browser

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/linkedin-tag-extension.git
cd linkedin-tag-extension

# Install dependencies
bun install
```

## Development

### Build

```bash
# Build the extension to ./dist
bun run build

# Watch mode (rebuilds on file changes)
bun run watch
```

### Load in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `./dist` directory


## Project Structure

```
src/
  types.ts           # Shared TypeScript interfaces
  content/           # Content script injected into LinkedIn pages
  popup/             # Extension popup UI
dist/                # Build output (gitignored)
icons/               # Extension icons
build.ts             # Bun build script
manifest.json        # Chrome extension manifest v3
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run the build to ensure it compiles: `bun run build`
5. Run tests: `bun test`
6. Commit your changes: `git commit -m "Add your feature"`
7. Push to your fork: `git push origin feature/your-feature`
8. Open a Pull Request

### Code Style

- Use `import type` for type-only imports
- Follow existing naming conventions (kebab-case files, PascalCase interfaces, camelCase functions)
- Prefix CSS classes with `linkedin-tag-helper-*`
- Use async/await for Chrome APIs

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Language**: TypeScript (strict mode)
- **Platform**: Chrome Extension Manifest V3

## License

MIT
