const { ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const { format, paginate, getItem } = require('../utils/functions.js');

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
		.setNameLocalization('pt-BR', 'classificação')
		.setDescription('Show the global or local ranking of users')
		.setDescriptionLocalization('pt-BR', 'Mostra a classicação global ou local de usuários')
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('falcoins')
				.setDescription('View users ranked by falcoins')
				.setDescriptionLocalization('pt-BR', 'Veja a classificação de usuários por falcoins')
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalization('pt-BR', 'tipo')
						.setDescription('leaderboard of the server or global')
						.setDescriptionLocalization('pt-BR', 'classificação do servidor ou global')
						.setRequired(true)
						.addChoices(
							{
								name: 'server',
								name_localizations: { 'pt-BR': 'servidor' },
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
				.setDescriptionLocalization('pt-BR', 'Veja a classificação de usuários por rank')
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalization('pt-BR', 'tipo')
						.setDescription('leaderboard of the server or global')
						.setDescriptionLocalization('pt-BR', 'classificação do servidor ou global')
						.setRequired(true)
						.addChoices(
							{
								name: 'server',
								name_localizations: { 'pt-BR': 'servidor' },
								value: 'server',
							},
							{ name: 'global', value: 'global' }
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('wins')
				.setNameLocalization('pt-BR', 'vitórias')
				.setDescription('View users ranked by wins')
				.setDescriptionLocalization('pt-BR', 'Veja a classificação de usuários por vitórias')
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalization('pt-BR', 'tipo')
						.setDescription('leaderboard of the server or global')
						.setDescriptionLocalization('pt-BR', 'classificação do servidor ou global')
						.setRequired(true)
						.addChoices(
							{
								name: 'server',
								name_localizations: { 'pt-BR': 'servidor' },
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
				.setDescriptionLocalization('pt-BR', 'Veja a classificação de usuários pela quantidade de um item')
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalization('pt-BR', 'tipo')
						.setDescription('leaderboard of the server or global')
						.setDescriptionLocalization('pt-BR', 'classificação do servidor ou global')
						.setRequired(true)
						.addChoices(
							{
								name: 'server',
								name_localizations: { 'pt-BR': 'servidor' },
								value: 'server',
							},
							{ name: 'global', value: 'global' }
						)
				)
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item to be counted')
						.setDescriptionLocalization('pt-BR', 'item a ser contado')
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('vote')
				.setNameLocalization('pt-BR', 'votos')
				.setDescription('View users ranked by vote streak')
				.setDescriptionLocalization('pt-BR', 'Veja a classificação de usuários por votos diários')
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalization('pt-BR', 'tipo')
						.setDescription('leaderboard of the server or global')
						.setDescriptionLocalization('pt-BR', 'classificação do servidor ou global')
						.setRequired(true)
						.addChoices(
							{
								name: 'server',
								name_localizations: { 'pt-BR': 'servidor' },
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

			enums = {
				falcoins: 'falcoins',
				rank: 'rank',
				wins: 'vitorias',
				item: `inventory.${getItem(interaction.options.getString('item').toLowerCase())}`,
				vote: 'voteStreak',
			};

			const subcommand = interaction.options.getSubcommand();
			const type = enums[subcommand];

			if (subcommand === 'item') {
				var item = type.split('.')[1];
				var itemJSON = instance.items[item];

				if (itemJSON === undefined) {
					interaction.editReply({
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
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
							? `${itemJSON['emoji']} ${format(rank[i]['inventory'].get(item) ?? 0)}`
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
							ITEM: subcommand == 'item' ? itemJSON[interaction.locale] ?? itemJSON['en-US'] : '',
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
				const message = await interaction.editReply(paginator.components());
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
						ITEM: subcommand == 'item' ? itemJSON[interaction.locale] ?? itemJSON['en-US'] : '',
					})}`
				);
				await interaction.editReply({ embeds: [embeds[0]] });
			}
		} catch (error) {
			console.error(`leaderboard: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
	autocomplete: async ({ interaction, instance }) => {
		const focusedValue = interaction.options.getFocused().toLowerCase();
		const items = instance.items;
		const localeItems = Object.keys(items).map((key) => {
			var item = items[key][interaction.locale] ?? items[key]['en-US'];
			return item.split(' ').slice(1).join(' ').toLowerCase();
		});
		const filtered = localeItems.filter((choice) => choice.startsWith(focusedValue));
		await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25));
	},
};
