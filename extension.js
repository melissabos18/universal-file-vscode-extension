const vscode = require('vscode')
const path = require('path')
const fs = require('fs')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const disposable = vscode.commands.registerCommand('kaliber-universal-file-vscode-extension.universalFile', function () {
		const editor = vscode.window.activeTextEditor
		if (!editor) {
			vscode.window.showInformationMessage('No editor is active')
			return
		}

		const currentFilePath = editor.document.fileName
		const dir = path.dirname(currentFilePath)
		const extension = path.extname(currentFilePath)
		const baseName = capitalizeFirstLetter(path.basename(currentFilePath, extension))
		const newFileName = `${baseName}.universal${extension}`
		const newPathName = path.join(dir, newFileName)

		const text = `export { ${baseName} as default } from './${baseName}'`

		vscode.window.showInformationMessage(text)

		if (!fs.existsSync(newPathName)) {
			try {
				fs.writeFileSync(newPathName, text)
				const openPath = vscode.Uri.file(newPathName)
				vscode.workspace.openTextDocument(openPath).then(doc => {
					vscode.window.showTextDocument(doc)
				})
			} catch (err) {
				vscode.window.showErrorMessage(`Error creating file: ${err.message}`)
			}
		} else {
			vscode.window.showInformationMessage(`${newFileName} already exists`)
		}
	})

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1)
	}

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
