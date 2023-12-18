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
					title: instance.getMessage(interaction, 'SNAKE_GAME'),
					overTitle: instance.getMessage(interaction, 'GAME_OVER'),
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
				stopButton: instance.getMessage(interaction, 'STOP'),
				timeoutTime: 60000,
				playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
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
