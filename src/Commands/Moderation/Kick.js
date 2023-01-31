/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Kick a user from the server.',
			category: 'Moderation',
			usage: '<user> (reason)',
			userPerms: ['KICK_MEMBERS'],
			botPerms: ['KICK_MEMBERS'],
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		const kUser = await message.mentions.members.last() || await message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]);
		if (!kUser) return message.channel.send('Can\'t find user!');
		const kReason = args.slice(1).join(' ');
		if (!kReason) return message.channel.send('You Must Provide a reason.');

		try {
			const dmEmbed = new MessageEmbed()
				.setColor('RED')
				.setTitle('You have been Kicked')
				.addField('Information',
					`**❯ Server:** ${message.guild.name}
					**❯ Reason:** ${kReason}`
				)
				.setTimestamp();
			await this.client.users.cache.get(`${kUser.id}`).send({ embeds: [dmEmbed] });
		} catch (kErr) {
			console.log(kErr);
		}

		const kickEmbed = new MessageEmbed()
			.setDescription('~Kick~')
			.setColor('#FF3A00')
			.addField('Kicked User', `${kUser} - Hash: ${kUser.user.tag} - ID: ${kUser.id}`)
			.addField('Kicked By', `${message.author} - Hash: ${message.author.tag} - ID: ${message.author.id}`)
			.addField('Kicked In', message.channel.toString())
			.addField('Time', message.createdAt.toString())
			.addField('Reason', kReason)
			.setFooter({ text: 'Squad Bot Logging System' })
			.setTimestamp();

		const logs = new db.table('logstable');
		const klogs = logs.get(`kicklogs_${message.guild.id}`);
		if (klogs) {
			const kickChannel = message.guild.channels.cache.find(ch => ch.id === `${klogs.id}`);
			kickChannel.send({ embeds: [kickEmbed] });
		}

		message.guild.members.kick(kUser, { reason: `${kReason}  | Banned by: ${message.author.tag}` });
		message.channel.send(`:white_check_mark: ${kUser} (${kUser.user.tag}) **has been kicked for: ${kReason}**`).then(msg => setTimeout(() => msg.delete(), 80000));
	}

};
