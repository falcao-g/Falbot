const { SlashCommandBuilder } = require('discord.js');
const { FindEmoji } = require('falgames');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('findemoji')
		.setNameLocalizations({
			'pt-BR': 'cademoji',
			'es-ES': 'buscaremoji',
		})
		.setDescription('Test your memory with this game of find emoji')
		.setDescriptionLocalizations({
			'pt-BR': 'Teste sua memória com esse jogo de encontrar emojis',
			'es-ES': 'Prueba tu memoria con este juego de encontrar emojis',
		})
		.setDMPermission(false),
	execute: async ({ interaction, instance }) => {
		try {
			const Game = new FindEmoji({
				message: interaction,
				isSlashGame: true,
				embed: {
					title: instance.getMessage(interaction, 'FIND_EMOJI'),
					color: '#6E0070',
					description: instance.getMessage(interaction, 'REMEMBER_THE_EMOJIS'),
					findDescription: instance.getMessage(interaction, 'FIND_EMOJI_DESCRIPTION'),
				},
				timeoutTime: 60000,
				hideEmojiTime: 5000,
				buttonStyle: 'PRIMARY',
				emojis: ['🍉', '🍇', '🍊', '🍋', '🥭', '🍎', '🍏', '🥝'],
				winMessage: instance.getMessage(interaction, 'FIND_EMOJI_WIN'),
				loseMessage: instance.getMessage(interaction, 'FIND_EMOJI_LOSE'),
				timeoutMessage: instance.getMessage(interaction, 'FIND_EMOJI_TIMEOUT'),
				playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
			});

			Game.startGame();
		} catch (error) {
			console.error(`findemoji: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				components: [],
			});
		}
	},
};
