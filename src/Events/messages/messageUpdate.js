/* eslint-disable new-cap */
const Event = require('../../Structures/Event');
const SquadBotEmbed = require('../../Structures/SquadBotEmbed');
const {
	Util: { escapeMarkdown }
} = require('discord.js');
const { diffWordsWithSpace } = require('diff');
const db = require('quick.db');

module.exports = class extends Event {

	async run(old, message) {
		try {
			if (message.partial) await message.fetch();
			if (old.partial) await message.fetch();
		} catch {
			return;
		}

		if (!message.guild || old.content === message.content || message.author.bot) return;

		const logs = new db.table('logstable');
		const msglogs = logs.get(`messagelogs_${message.guild.id}`);
		if (!msglogs) return;
		const channel = message.guild.channels.cache.find(ch => ch.id === `${msglogs.id}`);
		if (!channel) return;
		const embed = new SquadBotEmbed()
			.setColor('BLUE')
			.setAuthor({ name: old.author.tag, iconURL: this.client.user.displayAvatarURL({ dynamic: true }) })
			.setTitle('Message Updated')
			.addFields(
				{ name: `**❯ Message ID:**`, value: old.id, inline: true },
				{ name: `**❯ Channel:**`, value: old.channel.toString(), inline: true },
				{ name: `**❯ Author:**`, value: `Display Name: \`${old.member.displayName}\` \nUsername: \`${old.author.tag}\` \nID: \`${old.author.id}\`` }
			)
			.setTimestamp()
			.setFooter({ text: 'Squad Bot Logging System' })
			.setURL(old.url)
			.splitFields(
				diffWordsWithSpace(
					escapeMarkdown(old.content),
					escapeMarkdown(message.content)
				)
					.map((result) =>
						result.added ?
							`**${result.value}**` :
							result.removed ?
								`**❯ Message:** \n~~${result.value}~~` :
								result.value
					)
					.join(' ')
			);
		channel.send({ embeds: [embed] });
	}

};
