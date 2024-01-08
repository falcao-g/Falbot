const { SlashCommandBuilder } = require('discord.js');
const { Minesweeper } = require('falgames');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('minesweeper')
		.setNameLocalizations({
			'pt-BR': 'campominado',
			'es-ES': 'buscaminas',
		})
		.setDescription('Play a game of minesweeper')
		.setDescriptionLocalizations({
			'pt-BR': 'Jogue uma partida de campo minado',
			'es-ES': 'Juega una partida de buscaminas',
		})
		.setDMPermission(false),
	execute: async ({ interaction, instance }) => {
		try {
			const Game = new Minesweeper({
				message: interaction,
				isSlashGame: true,
				embed: {
					title: instance.getMessage(interaction, 'MINESWEEPER'),
					color: '#6E0070',
					description: instance.getMessage(interaction, 'MINESWEEPER_DESCRIPTION'),
				},
				emojis: { flag: '🚩', mine: '💣' },
				mines: 5,
				timeoutTime: 60000,
				winMessage: instance.getMessage(interaction, 'MINESWEEPER_WIN'),
				loseMessage: instance.getMessage(interaction, 'MINESWEEPER_LOSE'),
				playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
			});

			Game.startGame();
		} catch (error) {
			console.error(`mineswepper: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				components: [],
			});
		}
	},
};
