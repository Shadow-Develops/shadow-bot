/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Remove a warning from a user.',
			category: 'Moderation',
			usage: '<user> (reason)',
			aliases: ['unwarn'],
			userPerms: ['MANAGE_ROLES'],
			botPerms: ['MANAGE_ROLES'],
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		const mod = message.author;
		const wUser = await message.mentions.members.last() || await message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]);
		if (!wUser) return message.reply('Invalid user.').then(msg => setTimeout(() => msg.delete(), 5000));
		let reason = args.join(' ').slice(22);
		if (!reason) {
			reason = 'N/A';
		}
		const logs = new db.table('logstable');

		const warning = new db.table('warningtable');
		const dbwarn = warning.get(`warning_${message.guild.id}_number_${wUser.id}`);

		if (dbwarn === null || dbwarn === 0) {
			message.channel.send(`Unable to remove any warnings ${mod}.\n${wUser} has 0 warnings already.`).then(msg => setTimeout(() => msg.delete(), 10000));
		} else {
			await warning.subtract(`warning_${message.guild.id}_number_${wUser.id}`, 1);
			const warnEmbed = new MessageEmbed()
				.setTitle('User Warning(s) Removed')
				.setColor('GREEN')
				.addField('User',
					`**❯ Username:** ${wUser.username}
					**❯ Discriminator:** ${wUser.discriminator}
					**❯ ID:** ${wUser.id}
					**❯ Mention:** ${wUser}
					\u200b`
				)
				.addField('Removed by',
					`**❯ Username:** ${mod.username}
					**❯ Discriminator:** ${mod.discriminator}
					**❯ ID:** ${mod.id}
					**❯ Mention:** ${mod}
					\u200b`
				)
				.addField('Removed In',
					`**❯ Channel:** ${message.channel.toString()}
					**❯ ID:** ${message.channel.id}
					\u200b`
				)
				.setFooter({ text: 'Squad Bot Logging System' })
				.setTimestamp()
				.addField('Reason', reason)
				.addField('New Number of Warnings', await dbwarn.toString());

			const wlogs = logs.get(`warnlogs_${message.guild.id}`);
			if (wlogs) {
				const warnchannel = message.guild.channels.cache.find(channel => channel.id === `${wlogs.id}`);
				warnchannel.send({ embeds: [warnEmbed] });
			}
			message.channel.send(`<@${wUser.id}> had 1 warning removed.`).then(msg => setTimeout(() => msg.delete(), 5000));
		}
	}

};
