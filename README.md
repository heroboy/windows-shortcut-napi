# windows-shortcut-napi

Create Windows `.lnk` shortcuts from Node.js through N-API.

This package is intended for the same use case as [windows-shortcuts](https://www.npmjs.com/package/windows-shortcuts), but it uses a native addon instead of spawning a shell process. That avoids the common ANSI code page limitation when passing non-ASCII paths or arguments through the console.

## Features

- Native N-API implementation for creating Windows shortcuts
- Supports Unicode paths and arguments without going through the console
- Simple API for basic and advanced shortcut creation
- Throws structured errors with native status information
- Includes TypeScript declarations

## Requirements

- Windows
- Node.js with native addon support

## Installation

```bash
npm install windows-shortcut-napi
```

## Usage

### Basic usage

```js
const shortcut = require('windows-shortcut-napi');

shortcut.create('C:/Users/YourName/Desktop/Notepad.lnk', 'C:/Windows/System32/notepad.exe');
```

### Create a shortcut with options

```js
const path = require('path');
const shortcut = require('windows-shortcut-napi');

shortcut.create(path.join(__dirname, 'Notepad.lnk'), {
	target: 'C:/Windows/System32/notepad.exe',
	args: 'C:/temp/example.txt',
	workingDir: 'C:/temp',
	runStyle: shortcut.SW_SHOWNORMAL,
	icon: 'C:/Windows/System32/shell32.dll',
	iconIndex: 0,
	hotkey: 0,
	desc: 'Open example.txt with Notepad',
});
```

### Error handling

```js
const shortcut = require('windows-shortcut-napi');

try {
	shortcut.create('C:/invalid/path/test.lnk', {
		target: 'C:/missing/file.exe',
	});
} catch (error) {
	if (error instanceof shortcut.ShortcutError) {
		console.error(error.message);
		console.error('reason:', error.reason);
		console.error('status:', error.status);
		console.error('hr:', error.hr);
	} else {
		throw error;
	}
}
```

## API

### `create(path, target)`

Creates a shortcut at `path` that points to `target`.

Parameters:

- `path: string` - Output `.lnk` file path
- `target: string` - Target file or executable path

Returns:

- `void`

Throws:

- `TypeError` when arguments are invalid
- `ShortcutError` when the native shortcut creation fails

### `create(path, options)`

Creates a shortcut at `path` using the provided options.

Parameters:

- `path: string` - Output `.lnk` file path
- `options: ShortcutCreateOptions` - Shortcut configuration

#### `ShortcutCreateOptions`

- `target: string` - Target file or executable path
- `args?: string | null` - Command-line arguments
- `workingDir?: string | null` - Working directory
- `runStyle?: number | null` - Window show mode
- `icon?: string | null` - Icon source path
- `iconIndex?: number | null` - Icon resource index
- `hotkey?: number | null` - Windows shortcut hotkey value
- `desc?: string | null` - Shortcut description

Returns:

- `void`

Throws:

- `TypeError` when arguments are invalid
- `ShortcutError` when the native shortcut creation fails

### `query(path)`

Reads an existing shortcut and returns its configured values.

Parameters:

- `path: string` - Existing `.lnk` file path

Returns:

- `ShortcutInfo`

`ShortcutInfo` fields:

- `target: string`
- `args: string`
- `workingDir: string`
- `icon: string`
- `iconIndex: number`
- `hotkey: number`
- `runStyle: number`

Throws:

- `TypeError` when arguments are invalid
- `ShortcutError` when the native query call fails

### Constants

- `SW_SHOWNORMAL` - Show the target window normally
- `SW_SHOWMAXIMIZED` - Show the target window maximized
- `SW_SHOWMINNOACTIVE` - Minimize the target window without activating it

### `ShortcutError`

Error type thrown when the native layer fails to create a shortcut.

Properties:

- `message: string` - Human-readable error message
- `reason: string` - Native error reason
- `status: number` - Internal addon status code
- `hr: number` - Windows HRESULT code

## Why this package exists

Some JavaScript solutions create shortcuts by invoking Windows shell commands or helper scripts. That approach can break when the command line is limited by the active ANSI code page, especially for Chinese, Japanese, Korean, or other non-ASCII file names.

This package calls the Windows Shell Link APIs directly through N-API, so paths and arguments are passed as Unicode strings instead of going through console encoding.

## TypeScript

This package ships with declaration files, so TypeScript projects can use it without extra setup.

```ts
import shortcut = require('windows-shortcut-napi');

shortcut.create('C:/Users/YourName/Desktop/App.lnk', {
	target: 'C:/Program Files/My App/app.exe',
	args: '--profile default',
	runStyle: shortcut.SW_SHOWMAXIMIZED,
	desc: 'Launch My App',
});
```

## Notes

- This package creates `.lnk` shortcuts only.
- It is Windows-only.
- The `hotkey` value is passed directly to the Windows Shell Link API.

## License

ISC