const { glob } = require("glob")
//change this to use fs
const { promisify } = require("util")
const proGlob = promisify(glob)

async function loadFiles(dirName) {
	const Files = await proGlob(
		`${process.cwd().replace(/\\/g, "/")}/src/${dirName}/**/*.js`
	)
	Files.forEach((file) => delete require.cache[require.resolve(file)])
	return Files
}

module.exports = { loadFiles }
