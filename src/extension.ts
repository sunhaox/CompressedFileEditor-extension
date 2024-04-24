// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { getUri } from './utils/getUri';
import { getNonce } from './utils/getNonce';
import { getFileUri } from './utils/getFileUri';
import { isWin } from './utils/isWin';
import { getFileExtension } from './utils/getFileExtension';
import path = require('path');
import { execSync } from 'child_process';
import {
	COMMAND, 
	Message,
	MessageFromExtension,
	MessageHexString,
	MessageJsonString
} from "./model/message.model";


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "compressed-file-editor" is now active!');

	let _panel:vscode.WebviewPanel|undefined;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('compressed-file-editor.openFile', async (fileUri) => {
		// Get the input compressed file path.
		var filePath;
		if (typeof fileUri === 'undefined' || !(fileUri instanceof vscode.Uri)) {
			const editor = vscode.window.activeTextEditor;
			if(!editor) {
				let path = await vscode.window.showOpenDialog({
					canSelectFiles:true,       // open file?
					canSelectFolders: false,   // open folders?
					canSelectMany: false       // open multi files?
				});
				filePath = path?.[0].fsPath;
				if(!filePath) {
					vscode.window.showInformationMessage('No file selected.');
					return;
				}
			}
			else {
				filePath = editor.document.uri.fsPath;
			}
		}
		else {
			filePath = fileUri.fsPath;
		}

		// Genrate the JSON file if needed.
		if (vscode.workspace.getConfiguration().get('compressed-file-editor.generateJsonFile')) {
			let execString = "";
			const fileExtension = getFileExtension(filePath);
			switch(fileExtension) {
				case "gz":   execString = "gzip_dump"; break;
				case "zlib": execString = "zlib_dump"; break;
				case "lz4":  execString = "lz4_dump";  break;
				case "zst":  execString = "zstd_dump"; break;
			}

			if (execString === "") {
				const chooseItems = ["gzip", "zlib", "lz4", "zstd", "deflate"];
				let choose = await vscode.window.showQuickPick(chooseItems, {
					canPickMany: false,
					ignoreFocusOut: true,
					matchOnDescription: true,
					matchOnDetail: true,
					placeHolder: `Choose the compressed file algorithm:`
				});

				if (!choose) {
					return;
				}

				execString = choose + '_dump';
			}
			
			if (isWin()) {
				execString += ".exe";
				execString = path.join(context.extensionPath, "bin", "windows", execString);
			}
			else {
				execString = path.join(context.extensionPath, "bin", "linux", execString);
			}

			execString += ` "${filePath}"`;
			
			try {
				const rst = execSync(execString).toString();
			}
			catch (error) {
				vscode.window.showErrorMessage(`${error}`);
			}
		}
		
		// Create the webview.
		_panel = createWebview(context);

		// Read the compressed file.
		const hexString = (await openFile(filePath)).toString('hex');

		if(hexString === undefined){
			return;
		}

		var hexArray:string[][] = [];

		let i = 0;
		while(1) {
			let hexTempArray = [];
			for(let j = 0; j < 16 && i < hexString.length; i += 2, j++) {
				const chunk = hexString.slice(i, (i + 2));
				hexTempArray.push(chunk);
			}
			hexArray.push(hexTempArray);
			if(i >= hexString.length) {
				break;
			}
		}
		
		const hexMessage: MessageHexString = {
			command: COMMAND.hexStringMessage,
			data: {
				message: hexArray
			}
		};

		_panel.webview.postMessage(hexMessage);

		// Read the JSON file.
		const jsonString = await openJson(filePath);

		const jsonMessage: MessageJsonString = {
			command: COMMAND.jsonStringMessage,
			data: {
				message: jsonString
			}
		};

		_panel.webview.postMessage(jsonMessage);

	}));

}

// This method is called when your extension is deactivated
export function deactivate() {}

function createWebview(context: vscode.ExtensionContext) {
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
				vscode.Uri.joinPath(context.extensionUri, "webview/build"),
				vscode.Uri.joinPath(context.extensionUri, "media")
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
	const codiconsUri = getUri(panel.webview, context.extensionUri, ['media', 'codicon.css']);
	
	panel.webview.html=/*html*/ `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<meta http-equiv="Content-Security-Policy" content="default-src 'self' ${panel.webview.cspSource}; font-src ${panel.webview.cspSource} 'unsafe-inline'; style-src 'unsafe-inline' ${panel.webview.cspSource}; script-src 'nonce-${nonce}' ${panel.webview.cspSource}; img-src data:;">

				<link rel="stylesheet" type="text/css" href="${stylesUri}">
				<link rel="stylesheet" type="text/css" href="${codiconsUri}">
				<title>Hello World</title>
			</head>
			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
		</html>
	`;

	panel.webview.onDidReceiveMessage(
		(message: Message) => {
			const command = message.command;

			switch (command) {
				case COMMAND.testMessageFromWebview:
					vscode.window.showInformationMessage(message.data.message);
					return;
			}
		},
		undefined
	);

	return panel;
}

async function openFile(filePath: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			if(err) {
				reject(err);
			}
			else {
				resolve(data);
			}
		});
	});
}

async function openJson(filePath: string) {
	filePath = filePath + '_compressed.json';

	let doc:vscode.TextDocument|undefined;
	try {
		doc = await vscode.workspace.openTextDocument(filePath);
	}
	catch(error) {
		vscode.window.showErrorMessage((error as Error).message);
	}

	if(!doc) {
		return undefined;
	}

	return doc.getText();
}
