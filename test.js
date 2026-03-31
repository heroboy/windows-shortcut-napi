const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const shortcut = require('./');

const shortcutPath = path.join(__dirname, 'Notepad😊.lnk');
shortcut.create(shortcutPath, {
	target: 'C:/Windows/System32/notepad.exe',
	args: 'C:/temp/example.txt',
	workingDir: 'C:/temp',
	icon: 'C:/Windows/System32/shell32.dll',
	iconIndex: 0,
	hotkey: 0,
	runStyle: shortcut.SW_SHOWNORMAL,
});

assert.ok(fs.existsSync(shortcutPath), 'Shortcut was not created');
fs.unlinkSync(shortcutPath);

shortcut.create(shortcutPath, {
	target: 'C:/Windows/System32/notepad.exe',
	args: null,
	workingDir: undefined,
	icon: null,
	iconIndex: null,
	hotkey: undefined,
	runStyle: null,
	desc: null,
});

assert.ok(fs.existsSync(shortcutPath), 'Shortcut with nullable options was not created');
fs.unlinkSync(shortcutPath);

assert.throws(
	() => shortcut.create(shortcutPath, { target: 123 }),
	{ name: 'TypeError', message: 'targetOrOptions.target must be a string' }
);

assert.throws(
	() => shortcut.create(shortcutPath, { target: 'C:/Windows/System32/notepad.exe', iconIndex: '0' }),
	{ name: 'TypeError', message: 'targetOrOptions.iconIndex must be a number' }
);

assert.throws(
	() => shortcut.create(shortcutPath, { target: 'C:/Windows/System32/notepad.exe', desc: 1 }),
	{ name: 'TypeError', message: 'targetOrOptions.desc must be a string' }
);

assert.throws(
	() => shortcut.create('a.lnk', 'C:/Windows/System32/notepad.exe'),
	shortcut.ShortcutCreateError
);

