#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const bindingPath = path.join(__dirname, '..', 'lib', 'bindings.node');
const maxReleaseSize = 500 * 1024;

if (!fs.existsSync(bindingPath)) {
	console.error('[check-release-binding] Missing binary:', bindingPath);
	console.error('[check-release-binding] Build/copy the Release binary before publishing.');
	process.exit(1);
}

const stat = fs.statSync(bindingPath);
const size = stat.size;

if (size > maxReleaseSize && process.env.ALLOW_DEBUG_BINDING !== '1') {
	console.error('[check-release-binding] Refusing to pack/publish a Debug native binary.');
	console.error('[check-release-binding] lib/bindings.node size:', size, 'bytes');
	console.error('[check-release-binding] Expected Release binary size <= 512000 bytes.');
	console.error('[check-release-binding] Set ALLOW_DEBUG_BINDING=1 to bypass this check intentionally.');
	process.exit(1);
}

console.log('[check-release-binding] OK: lib/bindings.node size check passed.');
