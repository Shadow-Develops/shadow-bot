/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const ms = require('ms');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['tban'],
			description: 'Temporarily ban a user from the server.',
			category: 'Moderation',
			usage: '<user> <time> (reason)',
			userPerms: ['BAN_MEMBERS'],
			botPerms: ['BAN_MEMBERS'],
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		const reason = args.slice(2).join(' ');
		if (!reason) {
			return message.channel.send('Please state a reason for the ban.').then(msg => setTimeout(() => msg.delete(), 10000));
		}
		const mentionedMember = await message.mentions.members.last() || await message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]);
		if (!mentionedMember) return message.channel.send(`I can't find that member, please make sure I can see every channel in the guild!`).then(msg => setTimeout(() => msg.delete(), 10000));
		if (!args[1]) return message.channel.send(`Please specify how long to ban a user!`).then(msg => setTimeout(() => msg.delete(), 10000));
		if (mentionedMember.roles.highest.position >= message.member.roles.highest.position && message.author.id === message.guild.ownerId) {
			return message.channel.send(`You can't tempban a member that has higher or equal roles to you!`).then(msg => setTimeout(() => msg.delete(), 10000));
		}
		const mod = message.author;

		const dmEmbed = new MessageEmbed()
			.setColor('RED')
			.setTitle('You have been Banned')
			.addField('Information',
				`**❯ Server:** ${message.guild.name}
				**❯ Time:** ${args[1]}
				**❯ Reason:** ${reason}`
			)
			.setTimestamp();
		await this.client.users.cache.get(`${mentionedMember.id}`).send({ embeds: [dmEmbed] });

		const banEmbed = new MessageEmbed()
			.setTitle('~Ban~')
			.setColor('#FF0400')
			.addField('Banned User',
				`**❯ Username**: ${mentionedMember.username}
				**❯ Discriminator:** ${mentionedMember.discriminator}
				**❯ ID:** ${mentionedMember.id}
				**❯ Mention:** ${mentionedMember}
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
			.addField('**❯ Time**', args[1])
			.setFooter({ text: 'Squad Bot Logging System' })
			.setTimestamp();

		const logs = new db.table('logstable');
		const blogs = logs.get(`banlogs_${message.guild.id}`);

		const unBanEmbed = new MessageEmbed()
			.setTitle('~Ban~')
			.setColor('GREEN')
			.addField('Unbanned User',
				`**❯ Mention:** ${mentionedMember}
				**❯ ID:** ${mentionedMember.id}
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

		if (blogs) {
			const banChannel = message.guild.channels.cache.find(ch => ch.id === `${blogs.id}`);
			banChannel.send({ embeds: [banEmbed] });
		}
		// eslint-disable-next-line max-len
		message.channel.send(`:white_check_mark: ${mentionedMember} (${mentionedMember.user.tag}) **has been banned. \n**Reason:** ${reason} \n**Time:** ${args[1]}**`).then(msg => setTimeout(() => msg.delete(), 80000));
		mentionedMember.ban({ reason: `${reason} | Banned by: ${mod.discriminator}` });
		// eslint-disable-next-line consistent-return
		setTimeout(() => {
			message.guild.members.unban(mentionedMember.id, 'Tempban Ended.');
			if (blogs) {
				const banChannel = message.guild.channels.cache.find(ch => ch.id === `${blogs.id}`);
				banChannel.send({ embeds: [unBanEmbed] });
			}
		}, ms(args[1]));
		return undefined;
	}

};

