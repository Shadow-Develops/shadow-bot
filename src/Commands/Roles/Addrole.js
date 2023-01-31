/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Add a role to a user.',
			category: 'Roles',
			usage: '<user> <role> (reason)',
			userPerms: ['MANAGE_ROLES'],
			botPerms: ['MANAGE_ROLES'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		const rMember = message.mentions.members.first() || message.guild.members.cache.find(mm => mm.user.tag === args[0]);
		if (!rMember) return message.channel.send('Please provide a user.');
		const role = message.guild.roles.cache.find(rl => rl.name === args[1]) || message.guild.roles.cache.find(rl => rl.id === args[1]) || message.mentions.roles.first();
		if (!role) return message.channel.send('Please provide a role to add.');
		let reason = args.slice(2).join(' ');
		if (!reason) reason = 'Not Provided.';

		if (rMember.roles.cache.has(role.id)) {
			return message.channel.send(`${rMember} (${rMember.user.tag}), already has the role, ${role.name}.`).then(msg => setTimeout(() => msg.delete(), 10000));
		} else {
			await rMember.roles.add(role.id).catch(console.error());
			message.channel.send(`The role, ${role.name}, has been added to ${rMember} (${rMember.user.tag}).`).then(msg => setTimeout(() => msg.delete(), 15000));
		}

		const embed = new MessageEmbed()
			.setTitle('~Role Added~')
			.setColor('GREEN')
			.addField('Role Added', `${role} - Role ID: ${role.id}`)
			.addField('Added to', `${rMember} - Hash: ${rMember.user.tag} - ID: ${rMember.id}`)
			.addField('Added By',
				`**❯ Mention:** ${message.author}
				**❯ Hash:** ${message.author.tag}
				**❯ ID:** ${message.author.id}`
			)
			.addField('Reason', reason)
			.setFooter({ text: 'Squad Bot Logging System' })
			.setTimestamp();

		const logs = new db.table('logstable');
		const rlogs = logs.get(`rolelogs_${message.guild.id}`);
		const roleChannel = message.guild.channels.cache.find(ch => ch.id === `${rlogs.id}`);
		if (roleChannel) roleChannel.send({ embeds: [embed] });
	}

};
