const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['timeup'],
			description: 'Show how long the bot has been on.',
			category: 'Utility',
			guildOnly: true
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		message.delete();

		const uptimeEmbed = new MessageEmbed()
			.addField(`My uptime:`, `${ms(this.client.uptime, { long: true })}`)
			.setColor('BLURPLE')
			.setTimestamp()
			.setFooter({ text: `Requested by ${message.author.username}` });

		message.channel.send({ embeds: [uptimeEmbed] });
	}

};
