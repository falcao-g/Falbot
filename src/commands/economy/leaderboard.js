const { ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const { format, paginate, getItem } = require('../../utils/functions.js');

async function getMember(guild, member_id) {
	try {
		return await guild.members.fetch(member_id);
	} catch {
		return undefined;
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setNameLocalizations({
			'pt-BR': 'classificação',
			'es-ES': 'clasificación',
		})
		.setDescription('Show the global or local ranking of users')
		.setDescriptionLocalizations({
			'pt-BR': 'Mostra a classicação global ou local de usuários',
			'es-ES': 'Muestra la clasificación global o local de usuarios',
		})
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('falcoins')
				.setDescription('View users ranked by falcoins')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja a classificação de usuários por falcoins',
					'es-ES': 'Ver usuarios clasificados por falcoins',
				})
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalizations({
							'pt-BR': 'tipo',
							'es-ES': 'tipo',
						})
						.setDescription('leaderboard of the server or global')
						.setDescriptionLocalizations({
							'pt-BR': 'classificação do servidor ou global',
							'es-ES': 'clasificación del servidor o global',
						})
						.setRequired(true)
						.addChoices(
							{
								name: 'server',
								name_localizations: { 'pt-BR': 'servidor', 'es-ES': 'servidor' },
								value: 'server',
							},
							{ name: 'global', value: 'global' }
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('rank')
				.setDescription('View users ranked by ranks')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja a classificação de usuários por rank',
					'es-ES': 'Ver usuarios clasificados por rango',
				})
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalizations({
							'pt-BR': 'tipo',
							'es-ES': 'tipo',
						})
						.setDescription('leaderboard of the server or global')
						.setDescriptionLocalizations({
							'pt-BR': 'classificação do servidor ou global',
							'es-ES': 'clasificación del servidor o global',
						})
						.setRequired(true)
						.addChoices(
							{
								name: 'server',
								name_localizations: { 'pt-BR': 'servidor', 'es-ES': 'servidor' },
								value: 'server',
							},
							{ name: 'global', value: 'global' }
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('wins')
				.setNameLocalizations({
					'pt-BR': 'vitórias',
					'es-ES': 'victorias',
				})
				.setDescription('View users ranked by wins')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja a classificação de usuários por vitórias',
					'es-ES': 'Ver usuarios clasificados por victorias',
				})
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalizations({
							'pt-BR': 'tipo',
							'es-ES': 'tipo',
						})
						.setDescription('leaderboard of the server or global')
						.setDescriptionLocalizations({
							'pt-BR': 'classificação do servidor ou global',
							'es-ES': 'clasificación del servidor o global',
						})
						.setRequired(true)
						.addChoices(
							{
								name: 'server',
								name_localizations: { 'pt-BR': 'servidor', 'es-ES': 'servidor' },
								value: 'server',
							},
							{ name: 'global', value: 'global' }
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('item')
				.setDescription('View users ranked by amount of an item')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja a classificação de usuários pela quantidade de um item',
					'es-ES': 'Ver usuarios clasificados por la cantidad de un item',
				})
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalizations({
							'pt-BR': 'tipo',
							'es-ES': 'tipo',
						})
						.setDescription('leaderboard of the server or global')
						.setDescriptionLocalizations({
							'pt-BR': 'classificação do servidor ou global',
							'es-ES': 'clasificación del servidor o global',
						})
						.setRequired(true)
						.addChoices(
							{
								name: 'server',
								name_localizations: { 'pt-BR': 'servidor', 'es-ES': 'servidor' },
								value: 'server',
							},
							{ name: 'global', value: 'global' }
						)
				)
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item to be counted')
						.setDescriptionLocalizations({
							'pt-BR': 'item a ser contado',
							'es-ES': 'item a contar',
						})
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('vote')
				.setNameLocalizations({
					'pt-BR': 'votos',
					'es-ES': 'votos',
				})
				.setDescription('View users ranked by vote streak')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja a classificação de usuários por votos diários',
					'es-ES': 'Ver el ranking de usuarios por votos diarios',
				})
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalizations({
							'pt-BR': 'tipo',
							'es-ES': 'tipo',
						})
						.setDescription('leaderboard of the server or global')
						.setDescriptionLocalizations({
							'pt-BR': 'classificação do servidor ou global',
							'es-ES': 'clasificación del servidor o global',
						})
						.setRequired(true)
						.addChoices(
							{
								name: 'server',
								name_localizations: { 'pt-BR': 'servidor', 'es-ES': 'servidor' },
								value: 'server',
							},
							{ name: 'global', value: 'global' }
						)
				)
		),
	execute: async ({ client, guild, interaction, instance }) => {
		try {
			await interaction.deferReply().catch(() => {});
			var rank = [];
			const scope = interaction.options.getString('type');
			const embeds = [];
			const itemArgument = interaction.options.getString('item') ?? 'wood';

			enums = {
				falcoins: 'falcoins',
				rank: 'rank',
				wins: 'wins',
				item: `inventory.${getItem(itemArgument.toLowerCase())}`,
				vote: 'voteStreak',
			};

			const subcommand = interaction.options.getSubcommand();
			const type = enums[subcommand];

			if (subcommand === 'item') {
				var item = type.split('.')[1];
				var itemJSON = instance.items[item];

				if (itemJSON === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'BAD_VALUE', {
							VALUE: interaction.options.getString('item'),
						}),
					});
					return;
				}
			}

			if (scope === 'server') {
				users = await instance.userSchema.find({}).sort({ [type]: -1 });

				for (useri of users) {
					if (await getMember(guild, useri['_id'])) {
						rank.push(useri);
					}
				}
			} else {
				rank = await instance.userSchema
					.find({})
					.sort({ [type]: -1 })
					.limit(30);
			}

			for (let i = 0; i < rank.length; i++) {
				a = Math.min(Math.floor(i / 10), 2);

				if (a == embeds.length) embeds.push(instance.createEmbed('#206694'));

				try {
					member =
						scope == 'server' ? await getMember(guild, rank[i]['_id']) : await client.users.fetch(rank[i]['_id']);
					username = scope == 'server' ? member.displayName : member.username;
				} catch {
					username = 'Unknown user';
				}

				embeds[a].addFields({
					name: `${i + 1}º - ${username}:`,
					value:
						type == 'rank'
							? `${instance.getMessage(interaction, rank[i][type])}`
							: subcommand == 'item'
							? `${instance.getItemEmoji(item)} ${format(rank[i]['inventory'].get(item) ?? 0)}`
							: subcommand == 'vote'
							? `${Math.floor(format(rank[i][type]) / 2)} ${instance.getMessage(interaction, 'DAYS')}`
							: `${format(rank[i][type])}`,
				});
			}

			if (embeds.length > 1) {
				for (let i = 0; i < embeds.length; i++) {
					embeds[i].setTitle(
						`${instance.getMessage(interaction, `LEADERBOARD_${scope.toUpperCase()}_TITLE`)} - ${i + 1}/3`
					);
					embeds[i].setDescription(
						`${instance.getMessage(interaction, `LEADERBOARD_${subcommand.toUpperCase()}_DESCRIPTION`, {
							ITEM: subcommand == 'item' ? instance.getItemName(item, interaction) : '',
						})}`
					);
				}

				const paginator = paginate();
				paginator.add(...embeds);
				const ids = [`${Date.now()}__left`, `${Date.now()}__right`];
				paginator.setTraverser([
					new ButtonBuilder().setEmoji('⬅️').setCustomId(ids[0]).setStyle('Secondary'),
					new ButtonBuilder().setEmoji('➡️').setCustomId(ids[1]).setStyle('Secondary'),
				]);
				const message = await instance.editReply(interaction, paginator.components());
				message.channel.createMessageComponentCollector().on('collect', async (i) => {
					if (i.customId === ids[0]) {
						await paginator.back();
						await i.update(paginator.components());
					} else if (i.customId === ids[1]) {
						await paginator.next();
						await i.update(paginator.components());
					}
				});
			} else {
				embeds[0].setTitle(instance.getMessage(interaction, `LEADERBOARD_${scope.toUpperCase()}_TITLE`));
				embeds[0].setDescription(
					`${instance.getMessage(interaction, `LEADERBOARD_${subcommand.toUpperCase()}_DESCRIPTION`, {
						ITEM: subcommand == 'item' ? instance.getItemName(item, interaction) : '',
					})}`
				);
				await instance.editReply(interaction, { embeds: [embeds[0]] });
			}
		} catch (error) {
			console.error(`leaderboard: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
	autocomplete: async ({ interaction, instance }) => {
		const focusedValue = interaction.options.getFocused().toLowerCase();
		const { items } = instance;
		const localeItems = Object.keys(items).map((key) => {
			return instance.getItemName(key, interaction);
		});
		const filtered = localeItems.filter((choice) => {
			if (
				choice.split(' ').slice(1).join(' ').toLowerCase().startsWith(focusedValue) ||
				choice.toLowerCase().startsWith(focusedValue)
			) {
				return true;
			}
		});
		await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25));
	},
};
