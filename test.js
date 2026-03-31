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

let queryResult = shortcut.query(shortcutPath);
assert.strictEqual(queryResult.target, path.resolve('C:/Windows/System32/notepad.exe'), 'Queried target does not match expected value');
assert.strictEqual(queryResult.args, 'C:/temp/example.txt', 'Queried args do not match expected value');
assert.strictEqual(queryResult.workingDir, 'C:/temp', 'Queried workingDir does not match expected value');
assert.strictEqual(queryResult.icon, 'C:/Windows/System32/shell32.dll', 'Queried icon does not match expected value');
assert.strictEqual(queryResult.iconIndex, 0, 'Queried iconIndex does not match expected value');
assert.strictEqual(queryResult.hotkey, 0, 'Queried hotkey does not match expected value');
assert.strictEqual(queryResult.runStyle, shortcut.SW_SHOWNORMAL, 'Queried runStyle does not match expected value');

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
queryResult = shortcut.query(shortcutPath);
assert.strictEqual(queryResult.args, '');
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
	shortcut.ShortcutError
);

assert.throws(
	() => shortcut.query('a.lnk'),
	shortcut.ShortcutError
);