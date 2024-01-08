const { SlashCommandBuilder } = require('discord.js');
const { MatchPairs } = require('falgames');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('matchpairs')
		.setNameLocalizations({
			'pt-BR': 'memoria',
			'es-ES': 'memoria',
		})
		.setDescription('Play a game of match pairs')
		.setDescriptionLocalizations({
			'pt-BR': 'Jogue o jogo da memória',
			'es-ES': 'Juega el juego de la memoria',
		})
		.setDMPermission(false),
	execute: async ({ interaction, instance }) => {
		try {
			const Game = new MatchPairs({
				message: interaction,
				isSlashGame: true,
				embed: {
					title: instance.getMessage(interaction, 'MATCH_PAIRS'),
					color: '#6E0070',
					description: instance.getMessage(interaction, 'MATCH_PAIRS_DESCRIPTION'),
				},
				timeoutTime: 60000,
				emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
				winMessage: instance.getMessage(interaction, 'MATCH_PAIRS_WIN'),
				loseMessage: instance.getMessage(interaction, 'MATCH_PAIRS_LOSE'),
				playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
			});

			Game.startGame();
		} catch (error) {
			console.error(`matchpairs: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				components: [],
			});
		}
	},
};
