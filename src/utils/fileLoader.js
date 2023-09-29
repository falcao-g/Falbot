const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function loadFiles(dirName) {
	const basePath = `${process.cwd().replace(/\\/g, '/')}/src/${dirName}`;

	const files = [];
	const items = await readdir(basePath);
	for (const item of items) {
		const itemPath = `${basePath}/${item}`;
		const itemStat = await stat(itemPath);
		if (itemStat.isDirectory()) {
			const subFiles = await loadFiles(`${dirName}/${item}`);
			files.push(...subFiles);
		} else if (itemPath.endsWith('.js')) {
			files.push(itemPath);
			delete require.cache[require.resolve(itemPath)];
		}
	}

	return files;
}

module.exports = { loadFiles };
