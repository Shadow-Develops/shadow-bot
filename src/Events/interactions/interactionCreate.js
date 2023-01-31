/* eslint-disable complexity */
/* eslint-disable no-bitwise */
/* eslint-disable max-depth */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
const Event = require('../../Structures/Event');
const db = require('quick.db');
// eslint-disable-next-line camelcase
const { green_light, blue_light, reddark, orange } = require('../../../colours.json');
const { MessageEmbed, Collection, MessageButton, MessageActionRow } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');

module.exports = class extends Event {

	async run(interaction) {
		await interaction.user.fetch();
		await interaction.deferUpdate();

		const rMember = interaction.message.guild.members.cache.find(mm => mm.user.id === interaction.user.id);
		const ticketEmbed = new db.table('ticketembed');
		const ticChannel = ticketEmbed.get(`channel_${interaction.message.guild.id}_${interaction.message.id}`);
		if (ticChannel) {
			if (interaction.customId === 'openTicket_function') {
				ticketCreator(interaction, rMember);
			}
		}

		if (interaction.message.channel.name.startsWith(`ticket-`)) {
			if (interaction.customId === 'close_function') {
				ticketCLose(interaction);
			} else if (interaction.customId === 'reopen_function') {
				ticketReopen(interaction);
			} else if (interaction.customId === 'transcript_function') {
				ticketTranscript(interaction);
			} else if (interaction.customId === 'delete_function') {
				ticketDelete(interaction);
			}
		}
	}

};

// eslint-disable-next-line consistent-return
async function ticketCreator(button, person) {
	const { message, user } = button;

	const tickets = new db.table('ticket');
	const ticketset = new db.table('ticketsettings');
	const cat = ticketset.get(`ticketcategory_${message.guild.id}`);

	const ticlimit = ticketset.get(`ticketlimit_${message.guild.id}`);
	if (ticlimit === 'true') {
		if (tickets.get(`guild_${message.guild.id}_member_${user.id}`) === true) {
			return message.channel.send(`${person}, You already have a open ticket!`).then(msg => setTimeout(() => msg.delete(), 10000));
		}
	}

	await tickets.add(`guild_${message.guild.id}`, 1);
	const ticNum = tickets.get(`guild_${message.guild.id}`);
	const tsrole = ticketset.get(`ticketsupportrole_${message.guild.id}`);
	const supportRole = message.guild.roles.cache.find(rl => rl.id === `${tsrole.id}`);
	const desc = ticketset.get(`ticketdescription_${message.guild.id}`);
	tickets.set(`guild_${message.guild.id}_member_${user.id}`, true);
	tickets.set(`ticketowner${ticNum}_${message.guild.id}`, user.id);

	const channelName = `ticket-${tickets.get(`guild_${message.guild.id}`)}`;
	message.guild.channels.create(channelName, {
		type: 'text',
		permissionOverwrites: [
			{
				id: user.id,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'],
				deny: ['MANAGE_MESSAGES']
			},
			{
				id: supportRole,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'MANAGE_MESSAGES']
			},
			{
				id: message.guild.id,
				deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
			}
		],
		parent: cat,
		topic: `Ticket ID: ${person.id} | Creator: ${person.user.username}`
	}, 'Creating Ticket')
		.then(async ticcat => {
			let prefix = db.get(`prefix_${message.guild.id}`);
			const defaultprefix = '*';
			if (prefix === null) {
				prefix = defaultprefix;
			}
			const embed = new MessageEmbed()
				.setColor('GREEN')
				.setDescription(
					`**Dear <@${person.id}>!**\n
					${desc === null ? 'Thank you for reaching out to us! We will be with you soon!' : desc}
					\u200b`
				)
				.addField('Adding/Removing Users/Roles',
					`**❯ Add:** Use \`${prefix}add <user or role>\` to add a user or role to the ticket.
					**❯ Remove:** Use \`${prefix}remove <user or role>\` to remove a user or role to the ticket.
					\u200b`
				)
				.addField('Renaming the ticket',
					`**❯** Use \`${prefix}rename <new name>\` to change the name.
					\u200b`
				)
				.setFooter({ text: `© ${new Date().getFullYear()} Shadow Development` })
				.setTimestamp();
			const closeButton = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setStyle('SECONDARY')
						.setLabel('Close Ticket')
						.setEmoji('🔒', false)
						.setCustomId('close_function')
				);
			await ticcat.send({ embeds: [embed], components: [closeButton] });

			message.channel.send(`${person}, Your ticket has been open: ${ticcat}`).then(msg => setTimeout(() => msg.delete(), 10000));

			const logs = new db.table('logstable');
			const ticlogs = logs.get(`ticketlogs_${message.guild.id}`);
			const ownerId = await tickets.get(`ticketowner${ticNum}_${message.guild.id}`);
			const owner = button.message.guild.members.cache.find(mm => mm.user.id === ownerId);
			const logEmbed = new MessageEmbed()
				.setTitle('Ticket Open')
				.setDescription(`Ticket: ${button.channel.name} (${button.channel.id})`)
				.setColor('GREEN')
				.addField('Owner',
					`**❯ Username:** ${owner.user.username}
					**❯ Discriminator:** ${owner.user.discriminator}
					**❯ ID:** ${owner.id}
					**❯ Mention:** ${owner}
					\u200b`
				)
				.setFooter({ text: 'Squad Bot Logging System' })
				.setTimestamp();
			if (ticlogs) {
				const ticLogsChannel = message.guild.channels.cache.find(ch => ch.id === `${ticlogs.id}`);
				await ticLogsChannel.send({ embeds: [logEmbed] });
			}
		});
}


async function ticketCLose(button) {
	const { message } = button;
	const { channel } = message;
	const tickets = new db.table('ticket');
	const ticketset = new db.table('ticketsettings');
	const ticNum = tickets.get(`guild_${message.guild.id}`);
	const owner = tickets.get(`ticketowner${ticNum}_${message.guild.id}`);
	const tsrole = ticketset.get(`ticketsupportrole_${message.guild.id}`);
	const supportRole = message.guild.roles.cache.find(rl => rl.id === `${tsrole.id}`);

	channel.permissionOverwrites.set([
		{
			id: owner,
			deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
		},
		{
			id: supportRole,
			allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'],
			deny: ['MANAGE_MESSAGES']
		},
		{
			id: message.guild.id,
			deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
		}
	], `Ticket Closed`);

	const whoClosed = new MessageEmbed()
		.setColor(orange)
		.setDescription(`Ticket Closed by ${button.user}`);
	const embed = new MessageEmbed()
		.setTitle('Staff Action Panel')
		.setDescription('Only Staff can now see the ticket.')
		.setTimestamp()
		.setFooter({ text: `© ${new Date().getFullYear()} Shadow Development` });
	const theButtons = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setStyle('SUCCESS')
				.setLabel('Reopen Ticket')
				.setEmoji('🔓', false)
				.setCustomId('reopen_function'),
			new MessageButton()
				.setStyle('PRIMARY')
				.setLabel('Save Transcript')
				.setEmoji('📑', false)
				.setCustomId('transcript_function'),
			new MessageButton()
				.setStyle('DANGER')
				.setLabel('Delete Ticket')
				.setEmoji('⛔', false)
				.setCustomId('delete_function')
		);
	await message.channel.send({ embeds: [whoClosed] });
	await message.channel.send({ embeds: [embed], components: [theButtons] })
		.catch(err => console.log(err));

	const logs = new db.table('logstable');
	const ticlogs = logs.get(`ticketlogs_${message.guild.id}`);
	const ownerId = await tickets.get(`ticketowner${ticNum}_${message.guild.id}`);
	const ownerr = button.message.guild.members.cache.find(mm => mm.user.id === ownerId);
	const logEmbed = new MessageEmbed()
		.setTitle('Ticket Close')
		.setDescription(`Ticket: ${button.channel.name} (${button.channel.id})`)
		.setColor('ORANGE')
		.addField('Owner',
			`**❯ Username:** ${ownerr.user.username}
			**❯ Discriminator:** ${ownerr.user.discriminator}
			**❯ ID:** ${ownerr.id}
			**❯ Mention:** ${ownerr}
			\u200b`
		)
		.setFooter({ text: 'Squad Bot Logging System' })
		.setTimestamp();
	if (ticlogs) {
		const ticLogsChannel = message.guild.channels.cache.find(ch => ch.id === `${ticlogs.id}`);
		await ticLogsChannel.send({ embeds: [logEmbed] });
	}
}

async function ticketReopen(button) {
	const { message } = button;
	const { channel } = message;
	const tickets = new db.table('ticket');
	const ticketset = new db.table('ticketsettings');
	const ticNum = tickets.get(`guild_${message.guild.id}`);
	const ownerId = await tickets.get(`ticketowner${ticNum}_${message.guild.id}`);
	const tsrole = ticketset.get(`ticketsupportrole_${message.guild.id}`);
	const supportRole = message.guild.roles.cache.find(rl => rl.id === `${tsrole.id}`);

	channel.permissionOverwrites.set([
		{
			id: ownerId,
			allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'],
			deny: ['MANAGE_MESSAGES']
		},
		{
			id: supportRole,
			allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'MANAGE_MESSAGES']
		},
		{
			id: message.guild.id,
			deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
		}
	], `Ticket Reopened`);

	message.delete();
	const whoOpen = new MessageEmbed()
		.setColor(green_light)
		.setDescription(`Ticket Reopened by ${button.user}`);
	message.channel.send({ embeds: [whoOpen] });
	const logs = new db.table('logstable');
	const ticlogs = logs.get(`ticketlogs_${message.guild.id}`);
	const ownerr = button.message.guild.members.cache.find(mm => mm.user.id === ownerId);
	const logEmbed = new MessageEmbed()
		.setTitle('Ticket Open')
		.setDescription(`Ticket: ${button.channel.name} (${button.channel.id})`)
		.setColor('GREEN')
		.addField('Owner',
			`**❯ Username:** ${ownerr.user.username}
			**❯ Discriminator:** ${ownerr.user.discriminator}
			**❯ ID:** ${ownerr.id}
			**❯ Mention:** ${ownerr}
			\u200b`
		)
		.setFooter({ text: 'Squad Bot Logging System' })
		.setTimestamp();
	if (ticlogs) {
		const ticLogsChannel = message.guild.channels.cache.find(ch => ch.id === `${ticlogs.id}`);
		await ticLogsChannel.send({ embeds: [logEmbed] });
	}
}

async function ticketTranscript(button) {
	const { message } = button;
	const { channel } = message;

	let messageCollection = new Collection();
	let channelMessages = await message.channel.messages.fetch({
		limit: 100
	}).catch(err => console.log(err));

	messageCollection = messageCollection.concat(channelMessages);

	while (channelMessages.size === 100) {
		const lastMessageId = channelMessages.lastKey();
		channelMessages = await message.channel.messages.fetch({ limit: 100, before: lastMessageId }).catch(err => console.log(err));
		if (channelMessages) { messageCollection = messageCollection.concat(channelMessages); }
	}

	const savingEmbed = new MessageEmbed()
		.setColor(blue_light)
		.setAuthor({ name: 'Saving Transcript...', iconURL: 'https://cdn.discordapp.com/emojis/757632044632375386.gif?v=1' })
		.setFooter({ text: `© ${new Date().getFullYear()} Shadow Development` })
		.setTimestamp();
	const savingEmbedMSG = await message.channel.send({ embeds: [savingEmbed] });
	const savedEmbed = new MessageEmbed()
		.setColor(green_light)
		.setAuthor({ name: 'Transcript Saved.', iconURL: 'https://cdn.discordapp.com/attachments/633499606164176897/876128838134947920/bverified.gif' })
		.setFooter({ text: `© ${new Date().getFullYear()} Shadow Development` })
		.setTimestamp();

	const file = await discordTranscripts.createTranscript(channel);

	const logs = new db.table('logstable');
	const tickets = new db.table('ticket');
	const tictranslogs = logs.get(`tickettranscriptlogs_${message.guild.id}`);
	const ticNum = tickets.get(`guild_${message.guild.id}`);
	const ownerId = await tickets.get(`ticketowner${ticNum}_${message.guild.id}`);
	const owner = button.message.guild.members.cache.find(mm => mm.user.id === ownerId);
	const logEmbed = new MessageEmbed()
		.setTitle('Transcript Saved')
		.setDescription(`Ticket: ${button.channel.name} (${button.channel.id})`)
		.setColor('BLUE')
		.addField('Owner',
			`**❯ Username:** ${owner.user.username}
			**❯ Discriminator:** ${owner.user.discriminator}
			**❯ ID:** ${owner.id}
			**❯ Mention:** ${owner}
			\u200b`
		)
		.addField('Saved by',
			`**❯ Username:** ${button.user.username}
			**❯ Discriminator:** ${button.user.discriminator}
			**❯ ID:** ${button.user.id}
			**❯ Mention:** ${button.user}
			\u200b`
		)
		.setFooter({ text: 'Squad Bot Logging System' })
		.setTimestamp();

	if (tictranslogs) {
		const ticLogsChannel = message.guild.channels.cache.find(ch => ch.id === `${tictranslogs.id}`);
		const fileSent = await ticLogsChannel.send({ embeds: [logEmbed], files: [file] });
		if (fileSent) {
			await savingEmbedMSG.delete().then(channel.send({ embeds: [savedEmbed] }));
		}
	} else {
		const saveFailedEmbed = new MessageEmbed()
			.setColor(reddark)
			.setAuthor({ name: 'Transcript Failed to Save.', iconURL: 'https://cdn.discordapp.com/attachments/633499606164176897/876544222193397780/danger.png' })
			.setDescription('Make sure you have your transcript logs setup within the bot\'s settings.')
			.setFooter({ text: `© ${new Date().getFullYear()} Shadow Development` })
			.setTimestamp();
		await savingEmbedMSG.delete().then(channel.send({ embeds: [saveFailedEmbed] }));
	}
}

async function ticketDelete(button) {
	const { message, user } = button;
	const { channel } = message;
	const tickets = new db.table('ticket');
	const ticNum = tickets.get(`guild_${message.guild.id}`);
	await tickets.get(`guild_${message.guild.id}_member_${user.id}`);
	await tickets.get(`ticketowner${ticNum}_${message.guild.id}`);

	const embed = new MessageEmbed()
		.setColor(reddark)
		.setAuthor({ name: 'Deleting Ticket...', iconURL: 'https://cdn.discordapp.com/emojis/757632044632375386.gif?v=1' })
		.setFooter({ text: `© ${new Date().getFullYear()} Shadow Development` })
		.setTimestamp();

	message.edit({ embeds: [embed] })
		.then(
			setTimeout(() => {
				tickets.delete(`ticketowner${ticNum}_${message.guild.id}`);
				tickets.delete(`guild_${message.guild.id}_member_${user.id}`);
				channel.delete();
			}, 2000)
		);

	const logs = new db.table('logstable');
	const ticlogs = logs.get(`ticketlogs_${message.guild.id}`);
	const ownerId = await tickets.get(`ticketowner${ticNum}_${message.guild.id}`);
	const owner = button.message.guild.members.cache.find(mm => mm.user.id === ownerId);
	const logEmbed = new MessageEmbed()
		.setTitle('Ticket Deleted')
		.setDescription(`Ticket: ${button.channel.name} (${button.channel.id})`)
		.setColor('RED')
		.addField('Owner',
			`**❯ Username:** ${owner.user.username}
			**❯ Discriminator:** ${owner.user.discriminator}
			**❯ ID:** ${owner.id}
			**❯ Mention:** ${owner}
			\u200b`
		)
		.addField('Deleted by',
			`**❯ Username:** ${button.user.username}
			**❯ Discriminator:** ${button.user.discriminator}
			**❯ ID:** ${button.user.id}
			**❯ Mention:** ${button.user}
			\u200b`
		)
		.setFooter({ text: 'Squad Bot Logging System' })
		.setTimestamp();
	if (ticlogs) {
		const ticLogsChannel = message.guild.channels.cache.find(ch => ch.id === `${ticlogs.id}`);
		await ticLogsChannel.send({ embeds: [logEmbed] });
	}
}
