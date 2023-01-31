/* eslint-disable new-cap */
const Event = require('../../Structures/Event');
const SquadBotEmbed = require('../../Structures/SquadBotEmbed');
const db = require('quick.db');

module.exports = class extends Event {

	async run(message) {
		try {
			if (message.partial) await message.fetch();
		} catch {
			return;
		}

		const logs = new db.table('logstable');
		const msglogs = logs.get(`messagelogs_${message.guild.id}`);
		if (!msglogs) return;
		const channel = message.guild.channels.cache.find(ch => ch.id === `${msglogs.id}`);
		if (!channel) return;
		if (!message.guild || message.author.bot) return;
		const attachments = message.attachments.size ? message.attachments.map(attachment => attachment.proxyURL) : null;
		const embed = new SquadBotEmbed()
			.setColor('#0099ff')
			.setAuthor({ name: message.author.tag, iconURL: this.client.user.displayAvatarURL({ dynamic: true }) })
			.setTitle('Message Deleted')
			.addFields(
				{ name: `**❯ Message ID:**`, value: message.id, inline: true },
				{ name: `**❯ Channel:**`, value: message.channel.toString(), inline: true },
				{ name: `**❯ Author:**`, value: `Display Name: \`${message.member.displayName}\` \nUsername: \`${message.author.tag}\` \nID: \`${message.author.id}\`` }
			)
			.setTimestamp()
			.setFooter({ text: 'Squad Bot Logging System' });
		if (attachments) {
			embed.addField(`**❯ Attachments:**`, `${attachments.join('\n')}`);
		}
		if (message.content.length) {
			embed.splitFields(`**❯ Deleted Message:** \n${message.content}`);
		}
		channel.send({ embeds: [embed] });
	}

};
