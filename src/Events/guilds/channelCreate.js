const Event = require('../../Structures/Event');
// eslint-disable-next-line no-unused-vars
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

const channelType = {
	GUILD_TEXT: 'Text Channel',
	GUILD_VOICE: 'Voice Channel',
	GUILD_CATEGORY: 'Category',
	GUILD_NEWS: 'Announcement Channel',
	GUILD_STORE: 'Store Channel',
	GUILD_NEWS_THREAD: 'Announcement Thread',
	GUILD_PUBLIC_THREAD: 'Public Thread',
	GUILD_PRIVATE_THREAD: 'Private Thread',
	GUILD_STAGE_VOICE: 'Stage Voice Channel'
};

module.exports = class extends Event {

	async run(channel) {
		// eslint-disable-next-line new-cap
		const logs = new db.table('logstable');
		const clogs = logs.get(`channellogs_${channel.guild.id}`);
		if (!clogs) return;
		const embed = new MessageEmbed()
			.setTitle('Channel Created')
			.setColor('GREEN')
			.setTimestamp()
			.setFooter({ text: `Squad Bot Logging System` })
			.addField(`**❯ Channel Name:**`, `${channel.name}`)
			.addField(`**❯ Channel ID:**`, `${channel.id}`)
			.addField(`**❯ Channel Type:**`, `${channelType[channel.type]}`);

		const log = channel.guild.channels.cache.find(ch => ch.id === `${clogs.id}`);
		if (log) log.send({ embeds: [embed] });
	}

};
