/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['drole'],
			description: 'Delete a role.',
			category: 'Roles',
			usage: '<role>',
			userPerms: ['MANAGE_ROLES'],
			botPerms: ['MANAGE_ROLES'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		// eslint-disable-next-line id-length
		const roleDelete = message.guild.roles.cache.find(rl => rl.name === args[0]) || message.guild.roles.cache.find(rl => rl.id === args[0]) || message.mentions.roles.first();
		if (!roleDelete) return message.channel.send(`You did not specify the name or the id of the role to delete!`);
		roleDelete.delete();
		const Embed = new MessageEmbed()
			.setTitle(`Role Deletion!`)
			.setColor(roleDelete.color)
			.setDescription(`${message.author.username} has deleted the role "${roleDelete.name}"\n Role ID: ${roleDelete.id}\n Its hex color: ${roleDelete.color}`);
		message.channel.send({ embeds: [Embed] });

		const embed = new MessageEmbed()
			.setTitle('~Role Deleted~')
			.setColor('RED')
			.addField('Deleted Role',
				`**❯ Name:** ${roleDelete.name}
				**❯ Color:** ${roleDelete.color}
				**❯ ID:** ${roleDelete.id}
				\u200b`
			)
			.addField('Created By',
				`**❯ Mention:** ${message.author}
				**❯ Hash:** ${message.author.tag}
				**❯ ID:** ${message.author.id}`
			)
			.setFooter({ text: 'Squad Bot Logging System' })
			.setTimestamp();

		const logs = new db.table('logstable');
		const rlogs = logs.get(`rolelogs_${message.guild.id}`);
		const roleChannel = message.guild.channels.cache.find(ch => ch.id === `${rlogs.id}`);
		if (roleChannel) roleChannel.send({ embeds: [embed] });
	}

};
