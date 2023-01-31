/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const db = require('quick.db');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['new'],
			description: 'Open a new ticket',
			category: 'Tickets',
			usage: '(reason)',
			botPerms: ['MANAGE_CHANNELS'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message) {
		message.delete();
		const loadingMSG = await message.channel.send(`Ticket being created...`);
		ticketCreator(message, message.author).then(loadingMSG.delete());
	}

};

// eslint-disable-next-line consistent-return
async function ticketCreator(message, person) {
	const user = message.author;

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
		topic: `Ticket ID: ${person.id} | Creator: ${person.username}`
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
			const owner = message.guild.members.cache.find(mm => mm.user.id === ownerId);
			const logEmbed = new MessageEmbed()
				.setTitle('Ticket Open')
				.setDescription(`Ticket: ${ticcat.name} (${ticcat.id})`)
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
