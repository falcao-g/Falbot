module.exports = {
	name: "guildDelete",
	execute: async (guild, instance) => {
		console.log(guild.id)
		await instance.guildsSchema.deleteOne({ _id: guild.id })
	},
}
