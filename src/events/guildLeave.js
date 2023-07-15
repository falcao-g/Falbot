module.exports = {
	name: 'guildDelete',
	execute: async (guild, instance) => {
		await instance.guildsSchema.deleteOne({ _id: guild.id });
	},
};
