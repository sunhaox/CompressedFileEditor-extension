// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getUri } from './utils/getUri';
import { getNonce } from './utils/getNonce';
import { getFileUri } from './utils/getFileUri';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "compressed-file-editor" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('compressed-file-editor.openFile', () => {
		// Create HTML
        const panel = vscode.window.createWebviewPanel(
				'compressedFileEditor',
				'Compressed File Editor',
				vscode.ViewColumn.One,
				{
					enableFindWidget: true,
					enableScripts: true,
					localResourceRoots: [
						vscode.Uri.joinPath(context.extensionUri, "out"),
						vscode.Uri.joinPath(context.extensionUri, "webview/build")
					],
					retainContextWhenHidden: true
				}
			);
			
			const lightIconPath = getFileUri(panel.webview, context.extensionPath, ["media", "icon-light.svg"]);
			const darkIconPath = getFileUri(panel.webview, context.extensionPath, ["media", "icon-dark.svg"]);
			
			panel.iconPath = {
				light: lightIconPath,
				dark: darkIconPath
			};

			const stylesUri = getUri(panel.webview, context.extensionUri, [
				"webview",
				"build",
				"static",
				"css",
				"main.css",
			]);

			const scriptUri = getUri(panel.webview, context.extensionUri, [
				"webview",
				"build",
				"static",
				"js",
				"main.js",
			]);

			const nonce = getNonce();
			
			panel.webview.html=/*html*/ `
				<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="utf-8">
						<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
						<meta name="theme-color" content="#000000">
						<meta http-equiv="Content-Security-Policy" content="default-src 'self' ; style-src ${panel.webview.cspSource}; script-src 'nonce-${nonce}';">
		
						<link rel="stylesheet" type="text/css" href="${stylesUri}">
						<title>Hello World</title>
					</head>
					<body>
						<noscript>You need to enable JavaScript to run this app.</noscript>
						<div id="root"></div>
						<script nonce="${nonce}" src="${scriptUri}"></script>
					</body>
				</html>
		  	`;

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
