#!/usr/bin/env node
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Wrapper script to run .esbuild.ts using tsx from the extension's node_modules.
 * This allows the VS Code build system to invoke the extension's build script.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tsxPath = join(__dirname, 'node_modules', '.bin', 'tsx');
const esbuildScript = join(__dirname, '.esbuild.ts');

// Pass through all command line arguments
const args = [esbuildScript, ...process.argv.slice(2)];

// Spawn tsx process
const proc = spawn(tsxPath, args, {
	cwd: __dirname,
	stdio: 'inherit',
	shell: true
});

proc.on('exit', (code) => {
	process.exit(code || 0);
});

proc.on('error', (err) => {
	console.error('Failed to start esbuild process:', err);
	process.exit(1);
});
