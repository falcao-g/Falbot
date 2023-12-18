const { SlashCommandBuilder } = require('discord.js');
const { TicTacToe } = require('falgames');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tictactoe')
		.setNameLocalizations({
			'pt-BR': 'velha',
			'es-ES': 'tresenraya',
		})
		.setDescription('Challenge someone to a game of tic tac toe')
		.setDescriptionLocalizations({
			'pt-BR': 'Desafie alguém para um jogo da velha',
			'es-ES': 'Desafía a alguien a un juego de tres en raya',
		})
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('user')
				.setNameLocalizations({
					'pt-BR': 'usuário',
					'es-ES': 'usuario',
				})
				.setDescription('user to challenge')
				.setDescriptionLocalizations({
					'pt-BR': 'usuário para desafiar',
					'es-ES': 'usuario para desafiar',
				})
				.setRequired(true)
		),
	execute: async ({ interaction, instance }) => {
		try {
			await interaction.deferReply().catch(() => {});

			const Game = new TicTacToe({
				message: interaction,
				isSlashGame: true,
				opponent: interaction.options.getUser('user'),
				embed: {
					title: instance.getMessage(interaction, 'TICTACTOE'),
					color: '#6E0070',
					statusTitle: 'Status',
					overTitle: instance.getMessage(interaction, 'GAME_OVER'),
				},
				emojis: {
					xButton: '❌',
					oButton: '🔵',
					blankButton: '➖',
				},
				mentionUser: true,
				timeoutTime: 60000,
				xButtonStyle: 'DANGER',
				oButtonStyle: 'PRIMARY',
				turnMessage: instance.getMessage(interaction, 'TICTACTOE_MOVE'),
				winMessage: instance.getMessage(interaction, 'TICTACTOE_WIN'),
				tieMessage: instance.getMessage(interaction, 'TICTACTOE_DRAW'),
				timeoutMessage: instance.getMessage(interaction, 'TICTACTOE_TIMEOUT'),
				playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY_2'),
			});

			Game.startGame();
		} catch (error) {
			console.error(`tictactoe: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				components: [],
			});
		}
	},
};
