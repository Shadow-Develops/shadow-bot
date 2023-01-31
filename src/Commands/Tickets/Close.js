/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const db = require('quick.db');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { orange } = require('../../../colours.json');
const { Permissions } = require('discord.js');


module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['lock'],
			description: 'Close a ticket',
			category: 'Tickets',
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message) {
		const ticketset = new db.table('ticketsettings');
		const tsrole = ticketset.get(`ticketsupportrole_${message.guild.id}`);
		const supportRole = message.guild.roles.cache.find(rl => rl.id === `${tsrole.id}`);
		if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Your not in a ticket channel.`).then(msg => setTimeout(() => msg.delete(), 10000));
		if (message.member.roles.cache.has(supportRole) || message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			ticketCLose(message);
		}
	}

};

async function ticketCLose(message) {
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
		.setDescription(`Ticket Closed by ${message.author}`);
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
	const ownerr = message.guild.members.cache.find(mm => mm.user.id === ownerId);
	const logEmbed = new MessageEmbed()
		.setTitle('Ticket Close')
		.setDescription(`Ticket: ${message.channel.name} (${message.channel.id})`)
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
