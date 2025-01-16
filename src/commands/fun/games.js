const { SlashCommandBuilder } = require('discord.js');
const { randint } = require('../../utils/functions');
const {
	Connect4,
	FindEmoji,
	Flood,
	MatchPairs,
	Minesweeper,
	Snake,
	TicTacToe,
	TwoZeroFourEight,
	WouldYouRather,
	Trivia,
	FastType,
	GuessThePokemon,
	Hangman,
	RockPaperScissors,
	Wordle,
} = require('falgames');

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
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('2048').setDescription('Play the classic 2048 game').setDescriptionLocalizations({
				'pt-BR': 'Jogue o clássico jogo 2048',
				'es-ES': 'Juega el clásico juego 2048',
			})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('wouldyourather')
				.setNameLocalizations({
					'pt-BR': 'vocêprefere',
					'es-ES': 'prefieres',
				})
				.setDescription('Choose what you would rather do')
				.setDescriptionLocalizations({
					'pt-BR': 'Escolha o que você prefere fazer',
					'es-ES': 'Elige qué preferirías hacer',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('trivia')
				.setDescription('See how much useless knowledge you know')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja o quanto de conhecimento inútil você sabe',
					'es-ES': 'Ve cuánto conocimiento inútil sabes',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('fasttype')
				.setNameLocalizations({
					'pt-BR': 'digiterápido',
					'es-ES': 'escribirrápido',
				})
				.setDescription('Can you type fast?')
				.setDescriptionLocalizations({
					'pt-BR': 'Você consegue digitar rápido?',
					'es-ES': '¿Puedes escribir rápido?',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('pokemon').setDescription('What pokemon is this?').setDescriptionLocalizations({
				'pt-BR': 'Que pokemon é esse?',
				'es-ES': '¿Qué pokemon es este?',
			})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('hangman')
				.setNameLocalizations({
					'pt-BR': 'forca',
					'es-ES': 'ahorcado',
				})
				.setDescription('Find out the mystery word')
				.setDescriptionLocalizations({
					'pt-BR': 'Descubra a palavra misteriosa',
					'es-ES': 'Descubre la palabra misteriosa',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('rockpaperscissors')
				.setNameLocalizations({
					'pt-BR': 'jokenpô',
					'es-ES': 'piedrapapeltijera',
				})
				.setDescription('Challenge someone to a game of rock paper scissors')
				.setDescriptionLocalizations({
					'pt-BR': 'Desafie alguém para um jogo de jokenpô',
					'es-ES': 'Desafía a alguien a un juego de piedra papel tijera',
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
			subcommand.setName('wordle').setDescription('Play wordle from a random day').setDescriptionLocalizations({
				'pt-BR': 'Jogue wordle de um dia aleatório',
				'es-ES': 'Juega wordle de un día aleatorio',
			})
		),
	execute: async ({ interaction, instance, subcommand, member }) => {
		try {
			try {
				var type = interaction.options.getSubcommand();
			} catch {
				var type = subcommand;
			}
			const displayColor = await instance.getUserDisplay('displayColor', member);

			if (type === 'connect4') {
				var Game = new Connect4({
					message: interaction,
					isSlashGame: true,
					opponent: interaction.options.getUser('opponent'),
					embed: {
						title: ':brain: Connect4',
						color: displayColor,
					},
					emojis: {
						board: '⚪',
						player1: '🔴',
						player2: '🟡',
					},
					timeoutTime: 1000 * 60,
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
						color: displayColor,
						description: instance.getMessage(interaction, 'REMEMBER_THE_EMOJIS'),
						findDescription: instance.getMessage(interaction, 'FIND_EMOJI_DESCRIPTION'),
					},
					timeoutTime: 1000 * 60,
					hideEmojiTime: 8000,
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
						color: displayColor,
					},
					difficulty: 13,
					timeoutTime: 1000 * 60,
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
						color: displayColor,
						description: instance.getMessage(interaction, 'MATCH_PAIRS_DESCRIPTION'),
					},
					timeoutTime: 1000 * 60,
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
						color: displayColor,
						description: instance.getMessage(interaction, 'MINESWEEPER_DESCRIPTION'),
					},
					emojis: { flag: '🚩', mine: '💣' },
					mines: 5,
					timeoutTime: 1000 * 60,
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
						scoreText: instance.getMessage(interaction, 'SCORE'),
						color: displayColor,
					},
					emojis: {
						board: '⬛',
						up: '⬆️',
						down: '⬇️',
						left: '⬅️',
						right: '➡️',
					},
					snake: { head: '🤑', body: '🟩', tail: '🟢', over: '💥' },
					foods: ['💰', '🪙', '💵', '💎', '💸', '💳'],
					stopButton: instance.getMessage(interaction, 'STOP'),
					timeoutTime: 1000 * 60,
					playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
				});
			} else if (type === 'tictactoe') {
				var Game = new TicTacToe({
					message: interaction,
					isSlashGame: true,
					opponent: interaction.options.getUser('opponent'),
					embed: {
						title: instance.getMessage(interaction, 'TICTACTOE'),
						color: displayColor,
						overTitle: instance.getMessage(interaction, 'GAME_OVER'),
					},
					emojis: {
						xButton: '❌',
						oButton: '🔵',
						blankButton: '➖',
					},
					timeoutTime: 1000 * 60,
					turnMessage: instance.getMessage(interaction, 'FALGAMES_MOVE'),
					winMessage: instance.getMessage(interaction, 'FALGAMES_WIN'),
					tieMessage: instance.getMessage(interaction, 'FALGAMES_DRAW'),
					timeoutMessage: instance.getMessage(interaction, 'FALGAMES_TIMEOUT'),
					playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY_2'),
				});
			} else if (type === '2048') {
				var Game = new TwoZeroFourEight({
					message: interaction,
					isSlashGame: true,
					embed: {
						title: '🔢 2048',
						color: displayColor,
					},
					emojis: {
						up: '⬆️',
						down: '⬇️',
						left: '⬅️',
						right: '➡️',
					},
					timeoutTime: 1000 * 60,
					stopButton: instance.getMessage(interaction, 'STOP'),
					playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
					scoreText: instance.getMessage(interaction, 'SCORE'),
					totalScoreText: instance.getMessage(interaction, 'SCORE'),
				});
			} else if (type === 'wouldyourather') {
				var Game = new WouldYouRather({
					message: interaction,
					isSlashGame: true,
					embed: {
						title: instance.getMessage(interaction, 'WOULD_YOU_RATHER'),
						color: displayColor,
					},
					buttons: {
						option1: '\u200b',
						option2: '\u200b',
					},
					errMessage: instance.getMessage(interaction, 'EXCEPTION'),
					playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
				});
			} else if (type === 'trivia') {
				var Game = new Trivia({
					message: interaction,
					isSlashGame: true,
					embed: {
						title: '❔ Trivia',
						description: instance.getMessage(interaction, 'TRIVIA_DESCRIPTION'),
						color: displayColor,
					},
					timeoutTime: 1000 * 60,
					mode: ['multiple', 'single'][randint(0, 1)],
					difficulty: ['easy', 'medium', 'hard'][randint(0, 2)],
					winMessage: instance.getMessage(interaction, 'TRIVIA_WIN'),
					loseMessage: instance.getMessage(interaction, 'TRIVIA_LOSE'),
					errMessage: instance.getMessage(interaction, 'EXCEPTION'),
					playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
				});
			} else if (type === 'fasttype') {
				const sentences = instance.getMessage(interaction, 'SENTENCES');
				const sentence = sentences[randint(0, sentences.length - 1)];
				var Game = new FastType({
					message: interaction,
					isSlashGame: true,
					embed: {
						title: instance.getMessage(interaction, 'FAST_TYPE'),
						description: instance.getMessage(interaction, 'TIME_TO_TYPE'),
						color: displayColor,
					},
					timeoutTime: 1000 * 600,
					sentence: sentence,
					winMessage: instance.getMessage(interaction, 'FAST_TYPE_WIN'),
					loseMessage: instance.getMessage(interaction, 'FAST_TYPE_LOSE'),
				});
			} else if (type === 'pokemon') {
				var Game = new GuessThePokemon({
					message: interaction,
					isSlashGame: true,
					embed: {
						title: instance.getMessage(interaction, 'POKEMON'),
						color: displayColor,
					},
					timeoutTime: 1000 * 60,
					winMessage: instance.getMessage(interaction, 'POKEMON_WIN'),
					loseMessage: instance.getMessage(interaction, 'POKEMON_LOSE'),
					errMessage: instance.getMessage(interaction, 'EXCEPTION'),
					playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
					typesText: instance.getMessage(interaction, 'TYPES'),
					abilitiesText: instance.getMessage(interaction, 'ABILITIES'),
				});
			} else if (type === 'hangman') {
				const words = instance.getMessage(interaction, 'HANGMAN_WORDS');
				const word = words[randint(0, words.length - 1)];
				var Game = new Hangman({
					message: interaction,
					isSlashGame: true,
					embed: {
						title: instance.getMessage(interaction, 'HANGMAN'),
						color: displayColor,
					},
					hangman: { hat: '🎩', head: '😟', shirt: '👕', pants: '🩳', boots: '👞👞' },
					customWord: word,
					timeoutTime: 1000 * 60,
					winMessage: instance.getMessage(interaction, 'WORDS_WIN'),
					loseMessage: instance.getMessage(interaction, 'WORDS_LOSE'),
					playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
				});
			} else if (type === 'rockpaperscissors') {
				var Game = new RockPaperScissors({
					message: interaction,
					isSlashGame: true,
					opponent: interaction.options.getUser('opponent'),
					embed: {
						title: '🪨📄✂️',
						description: instance.getMessage(interaction, 'BUTTON_BELOW'),
						color: displayColor,
					},
					buttons: {
						rock: instance.getMessage(interaction, 'ROCK'),
						paper: instance.getMessage(interaction, 'PAPER'),
						scissors: instance.getMessage(interaction, 'SCISSORS'),
					},
					emojis: {
						rock: '🌑',
						paper: '📰',
						scissors: '✂️',
					},
					timeoutTime: 1000 * 60,
					pickMessage: instance.getMessage(interaction, 'RPS_CHOICE'),
					winMessage: instance.getMessage(interaction, 'RPS_WIN'),
					tieMessage: instance.getMessage(interaction, 'FALGAMES_DRAW'),
					timeoutMessage: instance.getMessage(interaction, 'FALGAMES_TIMEOUT'),
					playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY_2'),
				});
			} else if (type === 'wordle') {
				var Game = new Wordle({
					message: interaction,
					isSlashGame: true,
					embed: {
						title: 'Wordle',
						color: displayColor,
					},
					timeoutTime: 1000 * 600,
					winMessage: instance.getMessage(interaction, 'WORDS_WIN'),
					loseMessage: instance.getMessage(interaction, 'WORDS_LOSE'),
					playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
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
