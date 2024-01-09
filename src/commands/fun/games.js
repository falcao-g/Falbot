const { SlashCommandBuilder } = require('discord.js');
const { Connect4, FindEmoji, Flood, MatchPairs, Minesweeper, Snake, TicTacToe } = require('falgames');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('games')
		.setNameLocalizations({
			'pt-BR': 'jogos',
			'es-ES': 'juegos',
		})
		.setDescription('Play trough a variety of games')
		.setDescriptionLocalizations({
			'pt-BR': 'Jogue uma variedade de jogos',
			'es-ES': 'Juega a una variedad de juegos',
		})
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('connect4')
				.setDescription('Connect 4 pieces and defeat your opponent')
				.setDescriptionLocalizations({
					'pt-BR': 'Conecte 4 peças e derrote seu oponente',
					'es-ES': 'Conecta 4 piezas y derrota a tu oponente',
				})
				.addUserOption((option) =>
					option
						.setName('opponent')
						.setNameLocalizations({
							'pt-BR': 'oponente',
							'es-ES': 'oponente',
						})
						.setDescription('opponent to play with')
						.setDescriptionLocalizations({
							'pt-BR': 'oponente para jogar',
							'es-ES': 'oponente para jugar',
						})
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
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
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('flood')
				.setNameLocalizations({
					'pt-BR': 'enchente',
					'es-ES': 'inundación',
				})
				.setDescription('Fill the board with the same color in this game')
				.setDescriptionLocalizations({
					'pt-BR': 'Preencha o tabuleiro com a mesma cor nesse jogo',
					'es-ES': 'Llena el tablero con el mismo color en este juego',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
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
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('minesweeper')
				.setNameLocalizations({
					'pt-BR': 'campominado',
					'es-ES': 'buscaminas',
				})
				.setDescription('Can you find all the mines?')
				.setDescriptionLocalizations({
					'pt-BR': 'Você consegue encontrar todas as minas?',
					'es-ES': '¿Puedes encontrar todas las minas?',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('snake')
				.setNameLocalizations({
					'pt-BR': 'cobrinha',
					'es-ES': 'serpiente',
				})
				.setDescription('Eat as much food as you can')
				.setDescriptionLocalizations({
					'pt-BR': 'Coma o máximo de comida que conseguir',
					'es-ES': 'Come la mayor cantidad de comida que puedas',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
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
				.addUserOption((option) =>
					option
						.setName('opponent')
						.setNameLocalizations({
							'pt-BR': 'oponente',
							'es-ES': 'oponente',
						})
						.setDescription('opponent to play with')
						.setDescriptionLocalizations({
							'pt-BR': 'oponente para jogar',
							'es-ES': 'oponente para jugar',
						})
						.setRequired(true)
				)
		),
	execute: async ({ interaction, instance, subcommand }) => {
		try {
			try {
				var type = interaction.options.getSubcommand();
			} catch {
				var type = subcommand;
			}

			if (type === 'connect4') {
				var Game = new Connect4({
					message: interaction,
					isSlashGame: true,
					opponent: interaction.options.getUser('opponent'),
					embed: {
						title: ':brain: Connect4',
						statusTitle: 'Status',
						color: '#6E0070',
					},
					emojis: {
						board: '⚪',
						player1: '🔴',
						player2: '🟡',
					},
					mentionUser: true,
					timeoutTime: 60000,
					buttonStyle: 'PRIMARY',
					turnMessage: instance.getMessage(interaction, 'FALGAMES_MOVE'),
					winMessage: instance.getMessage(interaction, 'FALGAMES_WIN'),
					tieMessage: instance.getMessage(interaction, 'FALGAMES_DRAW'),
					timeoutMessage: instance.getMessage(interaction, 'FALGAMES_TIMEOUT'),
					playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY_2'),
				});
			} else if (type === 'findemoji') {
				var Game = new FindEmoji({
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
			} else if (type === 'flood') {
				var Game = new Flood({
					message: interaction,
					isSlashGame: true,
					embed: {
						title: instance.getMessage(interaction, 'FLOOD_GAME'),
						color: '#6E0070',
					},
					difficulty: 13,
					timeoutTime: 60000,
					buttonStyle: 'PRIMARY',
					emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
					winMessage: instance.getMessage(interaction, 'FLOOD_WIN'),
					loseMessage: instance.getMessage(interaction, 'FLOOD_LOSE'),
					playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
				});
			} else if (type === 'matchpairs') {
				var Game = new MatchPairs({
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
			} else if (type === 'minesweeper') {
				var Game = new Minesweeper({
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
			} else if (type === 'snake') {
				var Game = new Snake({
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
			} else if (type === 'tictactoe') {
				var Game = new TicTacToe({
					message: interaction,
					isSlashGame: true,
					opponent: interaction.options.getUser('opponent'),
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
					turnMessage: instance.getMessage(interaction, 'FALGAMES_MOVE'),
					winMessage: instance.getMessage(interaction, 'FALGAMES_WIN'),
					tieMessage: instance.getMessage(interaction, 'FALGAMES_DRAW'),
					timeoutMessage: instance.getMessage(interaction, 'FALGAMES_TIMEOUT'),
					playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY_2'),
				});
			}

			Game.startGame();
		} catch (error) {
			console.error(`games: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
