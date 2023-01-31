/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const db = require('quick.db');
const errors = require('../../utils/errors.js');
const { Permissions } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Add a use to a ticket',
			category: 'Tickets',
			usage: '<user or role>',
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		const ticketset = new db.table('ticketsettings');
		const tsrole = ticketset.get(`ticketsupportrole_${message.guild.id}`);
		const supportRole = message.guild.roles.cache.find(rl => rl.id === `${tsrole.id}`);
		// eslint-disable-next-line max-len
		const addUser = await message.mentions.members.last() || await message.guild.members.cache.get(args[0]) || await message.mentions.roles.first() || await message.guild.members.fetch(args[0]) || await message.guild.roles.cache.find(rl => rl.name === args[0]) || await message.guild.roles.cache.find(rl => rl.id === args[0]);
		if (!addUser) return message.channel.send(`**Invalid Usage** | Please state a user or role to add.`).then(msg => setTimeout(() => msg.delete(), 8000));
		if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Your not in a ticket channel.`).then(msg => setTimeout(() => msg.delete(), 10000));
		if (message.member.roles.cache.has(supportRole) || message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			const { channel } = message;
			if (addUser) {
				channel.permissionOverwrites.create(addUser, {
					VIEW_CHANNEL: false,
					SEND_MESSAGES: false,
					EMBED_LINKS: false,
					ATTACH_FILES: false,
					MANAGE_MESSAGES: false
				});
				message.channel.send(`${addUser} has been removed to the ticket.`);
			}
		} else {
			return errors.noPerms(message, `${supportRole}`);
		}
	}

};
