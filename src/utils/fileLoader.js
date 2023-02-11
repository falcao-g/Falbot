const fs = require("fs")
const { promisify } = require("util")
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

async function loadFiles(dirName) {
	const basePath = `${process.cwd().replace(/\\/g, "/")}/src/${dirName}`

	let files = []
	const readDirectory = async (dir) => {
		const items = await readdir(dir)
		for (const item of items) {
			const itemPath = `${dir}/${item}`
			const itemStat = await stat(itemPath)
			if (itemStat.isDirectory()) {
				await readDirectory(itemPath)
			} else if (itemPath.endsWith(".js")) {
				files.push(itemPath)
				delete require.cache[require.resolve(itemPath)]
			}
		}
	}
	await readDirectory(basePath)

	return files
}

module.exports = { loadFiles }
