/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Warn a user.',
			category: 'Moderation',
			usage: '<user> (reason)',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		const mod = message.author;
		message.delete();
		const wUser = await message.mentions.members.last() || await message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]);
		if (!wUser) return message.reply('Invalid user.').then(msg => setTimeout(() => msg.delete(), 5000));
		let reason = args.join(' ').slice(22);
		const logs = new db.table('logstable');

		const warning = new db.table('warningtable');
		const dbwarn = warning.get(`warning_${message.guild.id}_number_${wUser.id}`);
		const dbwarnd = 'No Warnings';
		if (dbwarn === null) {
			warning.set(`warning_${message.guild.id}_number_${wUser.id}`, 1);
		} else {
			warning.add(`warning_${message.guild.id}_number_${wUser.id}`, 1);
		}

		if (!reason) {
			reason = 'N/A';
		}

		const dmEmbed = new MessageEmbed()
			.setColor('ORANGE')
			.setTitle('You have been Warned')
			.addField('Information',
				`**❯ Server:** ${message.guild.name}
				**❯ Reason:** ${reason}`
			)
			.setTimestamp();
		wUser.send({ embeds: [dmEmbed] });

		const warnEmbed = new MessageEmbed()
			.setTitle('User Warning')
			.setColor('#fc6400')
			.addField('User',
				`**❯ Username:** ${wUser.username}
				**❯ Discriminator:** ${wUser.discriminator}
				**❯ ID:** ${wUser.id}
				**❯ Mention:** ${wUser}
				\u200b`
			)
			.addField('Muted by',
				`**❯ Username:** ${mod.username}
				**❯ Discriminator:** ${mod.discriminator}
				**❯ ID:** ${mod.id}
				**❯ Mention:** ${mod}
				\u200b`
			)
			.addField('Warned In',
				`**❯ Channel:** ${message.channel.toString()}
				**❯ ID:** ${message.channel.id}
				\u200b`
			)
			.setFooter({ text: 'Squad Bot Logging System' })
			.setTimestamp()
			.addField('Reason', reason)
			.addField('Number of Warnings', `${dbwarn === null ? dbwarnd : dbwarn}`);

		const wlogs = logs.get(`warnlogs_${message.guild.id}`);
		if (wlogs) {
			const warnchannel = message.guild.channels.cache.find(channel => channel.id === `${wlogs.id}`);
			warnchannel.send({ embeds: [warnEmbed] });
		}
		message.channel.send(`${wUser} has been warned by ${mod.tag} for **${reason}**.`).then(msg => setTimeout(() => msg.delete(), 80000));
	}

};
