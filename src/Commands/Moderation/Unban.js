/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Unban a user from the server.',
			category: 'Moderation',
			usage: '<user> (reason)',
			userPerms: ['BAN_MEMBERS'],
			botPerms: ['BAN_MEMBERS'],
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();

		if (isNaN(args[0])) return message.channel.send('You need to provide an ID.').then(msg => setTimeout(() => msg.delete(), 10000));
		const userID = args[0];
		message.guild.bans.fetch().then(bans => {
			if (bans.size === 0) return;
			const bUser = bans.find(b => b.user.id === userID);
			const mod = message.author;
			if (!bUser) return;
			message.guild.members.unban(bUser.user, `${reason} | Unbanned by: ${message.author.tag}`);
			message.channel.send(`:white_check_mark: ${bUser.user} (${bUser.user.tag}) **has been unbanned for: ${reason}**`).then(msg => setTimeout(() => msg.delete(), 80000));

			try {
				const banEmbed = new MessageEmbed()
					.setTitle('~Unban~')
					.setColor('GREEN')
					.addField('Unbanned User',
						`**❯ Mention:** <@${userID}>
						**❯ ID:** ${userID}
						\u200b`
					)
					.addField('Unbanned By',
						`**❯ Username:** ${mod.username}
						**❯ Discriminator:** ${mod.discriminator}
						**❯ ID:** ${mod.id}
						**❯ Mention:** ${mod}
						\u200b`
					)
					.addField('**❯ Unbanned In**', message.channel.toString())
					.addField('**❯ Reason**', reason)
					.setFooter({ text: 'Squad Bot Logging System' })
					.setTimestamp();

				const logs = new db.table('logstable');
				const blogs = logs.get(`banlogs_${message.guild.id}`);
				if (blogs) {
					const banChannel = message.guild.channels.cache.find(ch => ch.id === `${blogs.id}`);
					banChannel.send({ embeds: [banEmbed] });
				}
			} catch {
				console.error();
			}
		});

		let reason = args.slice(1).join(' ');
		if (!reason) reason = 'No reason given!';
	}

};
