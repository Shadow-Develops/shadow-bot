/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Ban a user from the server.',
			category: 'Moderation',
			usage: '<user> <reason>',
			userPerms: ['BAN_MEMBERS'],
			botPerms: ['BAN_MEMBERS'],
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		const mod = message.author;

		const bUser = await message.mentions.members.last() || await message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]) || args[0];
		if (!bUser) return message.channel.send('Please provide a valid user. *(User must be in the server.)*').then(msg => setTimeout(() => msg.delete(), 10000));
		const reason = args.slice(1).join(' ');
		if (!reason) return message.channel.send('You need to provide a reason.').then(msg => setTimeout(() => msg.delete(), 10000));

		const dmEmbed = new MessageEmbed()
			.setColor('RED')
			.setTitle('You have been Banned')
			.addField('Information',
				`**❯ Server:** ${message.guild.name}
				**❯ Reason:** ${reason}`
			)
			.setTimestamp();
		if (message.guild.members.cache.get(bUser.id) || message.guild.members.cache.get(bUser)) {
			try {
				await this.client.users.cache.get(`${bUser.id}`).send({ embeds: [dmEmbed] });
			} catch (error) {
				console.log(error);
			}
		}

		const banEmbed = new MessageEmbed()
			.setTitle('~Ban~')
			.setColor('#FF0400')
			.addField('Banned User',
				`**❯ Username**: ${bUser.username === undefined ? 'N/A' : bUser.username}
				**❯ Discriminator:** ${bUser.discriminator === undefined ? 'N/A' : bUser.discriminator}
				**❯ ID:** ${bUser.id === undefined ? bUser : bUser.id}
				**❯ Mention:** <@${bUser}>
				\u200b`
			)
			.addField('Banned By',
				`**❯ Username:** ${mod.username}
				**❯ Discriminator:** ${mod.discriminator}
				**❯ ID:** ${mod.id}
				**❯ Mention:** ${mod}
				\u200b`
			)
			.addField('**❯ Banned In**', message.channel.toString())
			.addField('**❯ Reason**', reason)
			.setFooter({ text: 'Squad Bot Logging System' })
			.setTimestamp();

		const logs = new db.table('logstable');
		const blogs = logs.get(`banlogs_${message.guild.id}`);
		if (blogs) {
			const banChannel = message.guild.channels.cache.find(ch => ch.id === `${blogs.id}`);
			banChannel.send({ embeds: [banEmbed] });
		}

		try {
			bUser.ban({ reason: `${reason}  | Banned by: ${mod.username}#${mod.discriminator}` });
		} catch {
			message.guild.members.ban(bUser, { reason: `${reason}  | Banned by: ${mod.username}#${mod.discriminator}` });
		}
		// message.channel.send(`:white_check_mark: ${bUser} (${bUser.user.tag}) **has been banned for: ${reason}**`).then(msg => setTimeout(() => msg.delete(), 80000));
	}

};
