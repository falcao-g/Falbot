const { SlashCommandBuilder } = require('discord.js');
const { Snake } = require('falgames');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('snake')
		.setNameLocalizations({
			'pt-BR': 'cobrinha',
			'es-ES': 'serpiente',
		})
		.setDescription('Play a game of snake')
		.setDescriptionLocalizations({
			'pt-BR': 'Jogue o jogo da cobrinha',
			'es-ES': 'Juega el juego de la serpiente',
		})
		.setDMPermission(false),
	execute: async ({ interaction, instance }) => {
		try {
			const Game = new Snake({
				message: interaction,
				isSlashGame: true,
				embed: {
					title: 'Snake Game',
					overTitle: 'Game Over',
					color: '#6E0070',
				},
				emojis: {
					board: '⬛',
					up: '⬆️',
					down: '⬇️',
					left: '⬅️',
					right: '➡️',
				},
				snake: { head: '🟣', body: '🟩', tail: '🟢', over: '💥' },
				foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
				stopButton: 'Stop',
				timeoutTime: 60000,
				playerOnlyMessage: 'Only {player} can use these buttons.',
				scoreText: instance.getMessage(interaction, 'SCORE'),
			});

			Game.startGame();
		} catch (error) {
			console.error(`snake: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
