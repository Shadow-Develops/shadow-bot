/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Mute a user.',
			category: 'Moderation',
			usage: '<user> <time> (reason)',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		const mod = message.author;
		const logs = new db.table('logstable');
		const roles = new db.table('rolestable');
		const user = await message.mentions.members.last() || await message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]);
		if (!user) {
			return message.reply('Couldn\'t find user.').then(msg => setTimeout(() => msg.delete(), 5000));
		}
		if (!args[1]) return message.channel.send('You must enter a time!');
		let reason = args.slice(2).join(' ');
		const noreason = 'N/A';
		if (!reason) {
			reason = noreason;
		}

		const muteEmbed = new MessageEmbed()
			.setColor('RED')
			.setTitle('User Muted')
			.addField('User',
				`**❯ Username:** ${user.username}
				**❯ Discriminator:** ${user.discriminator}
				**❯ ID:** ${user.id}
				**❯ Mention:** ${user}
				\u200b`
			)
			.addField('Muted by',
				`**❯ Username:** ${mod.username}
				**❯ Discriminator:** ${mod.discriminator}
				**❯ ID:** ${mod.id}
				**❯ Mention:** ${mod}
				\u200b`
			)
			.addField('**❯ Reason**', `${reason}`)
			.setFooter({ text: 'Squad Bot Logging System' })
			.setTimestamp()
			.addField('**❯ Time**', `${args[1]}`);

		const mlogs = logs.get(`mutelogs_${message.guild.id}`);
		if (mlogs) {
			const muteChannel = message.guild.channels.cache.find(channel => channel.id === `${mlogs.id}`);
			muteChannel.send({ embeds: [muteEmbed] });
		}

		const dmEmbed = new MessageEmbed()
			.setColor('RED')
			.setTitle('You have been Muted')
			.addField('Information',
				`**❯ Server:** ${message.guild.name}
				**❯ Reason:** ${reason}
				**❯ Time:** ${args[1]}`
			)
			.setTimestamp();
		user.send({ embeds: [dmEmbed] });

		const mrole = roles.get(`muterole_${message.guild.id}`);

		await user.roles.add(mrole.id);
		message.channel.send(`<@${user.id}> has been temporarily muted. \n**❯ Reason:** ${reason} \n**❯ Time:** ${args[1]}`).then(msg => setTimeout(() => msg.delete(), 60000));

		setTimeout(() => {
			user.roles.remove(mrole.id);
			user.send(`Hello, you have been **unmuted** in **${message.guild.name}**.`);
		}, ms(args[1]));
	}

};
