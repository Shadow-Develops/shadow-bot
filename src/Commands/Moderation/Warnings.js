/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Check a users warnings.',
			category: 'Moderation',
			usage: `(user)`,
			aliases: ['warnlevel'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, [target]) {
		message.delete();
		const wUser = message.mentions.members.last() || message.guild.members.cache.get(target) || message.member;

		const warning = new db.table('warningtable');
		const dbwarn = warning.get(`warning_${message.guild.id}_number_${wUser.id}`);
		const dbwarnd = 'No Warnings';

		const warningEmbed = new MessageEmbed()
			.setTitle('User Warning Count')
			.setColor('ORANGE')
			.addField('User',
				`**❯ Name:** ${wUser}
				**❯ ID:** ${wUser.id}
				\u200b`
				, true)
			.setFooter({ text: `Replying to ${message.author.username}#${message.author.discriminator}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
			.setTimestamp()
			.addField('Number of Warnings:', `${dbwarn === null ? dbwarnd : dbwarn}`, true);

		return message.channel.send({ embeds: [warningEmbed] });
	}

};
