# Moshe's Tasks

A personal task management application built with Electron and React.

## Overview

Moshe's Tasks is a kanban-style task management application that helps you organize your work across different status columns. It features a clean, modern interface with support for dark mode and keyboard shortcuts.

## Features

- **Task Management**
  - Create, edit, and delete tasks
  - Drag and drop tasks between columns
  - Resolve tasks individually or in bulk
  - Track total resolved tasks

- **Columns**
  - Not Started
  - In Progress
  - Blocked
  - Resolved

- **Task Properties**
  - Name
  - Description
  - Priority (High/Low)
  - Tags
  - Status
  - Order

- **UI Features**
  - Dark/Light mode toggle
  - Custom scrollbars
  - Tooltips
  - Keyboard shortcuts
  - Responsive design

## Version History

### v1.2.0 (Current)
- Improved task ordering and position preservation
- Added resolve all functionality
- Added keyboard shortcuts (⌘ + N for new task)
- Enhanced tooltip system
- More robust data storage in `~/.moshestasks`
- Automatic backups and data migration
- Seeded resolved task count (100)

### v1.1.0
- Initial release with basic task management
- Column-based organization
- Dark mode support

## Keyboard Shortcuts

- `⌘ + N` (Mac) / `Ctrl + N` (Windows/Linux): Create new task

## Data Storage

The application stores data in the following locations:

- **Primary Storage**: `~/.moshestasks/tasks.json`
- **Backup Storage**: `~/.moshestasks/tasks_backup.json`

The app automatically:
- Creates backups before saving
- Migrates data from old locations
- Maintains task order and status

## Development Setup

### Prerequisites
- Node.js
- npm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
- Start development server:
  ```bash
  npm start
   ```

### Building
- Build the app:
  ```bash
  npm run build
   ```

### Packaging
- Package for macOS:
  ```bash
  npm run package
   ```
  This creates a versioned directory in `release-builds/v[version]`

## Contributing

This is a personal project, but feel free to fork and modify for your own use!

## License

Private - All rights reserved 