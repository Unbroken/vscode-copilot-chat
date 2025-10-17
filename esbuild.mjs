#!/usr/bin/env node
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Wrapper script to run .esbuild.ts using Node's native TypeScript support.
 * This allows the VS Code build system to invoke the extension's build script.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const esbuildScript = join(__dirname, '.esbuild.ts');

// Pass through all command line arguments
// Use Node's native TypeScript support instead of tsx for proper ESM support
const args = [
	'--experimental-strip-types',
	'--experimental-transform-types',
	'--no-warnings',
	esbuildScript,
	...process.argv.slice(2)
];

// Spawn Node process with TypeScript support
const proc = spawn(process.execPath, args, {
	cwd: __dirname,
	stdio: 'inherit'
});

proc.on('exit', (code) => {
	process.exit(code || 0);
});

proc.on('error', (err) => {
	console.error('Failed to start esbuild process:', err);
	process.exit(1);
});
