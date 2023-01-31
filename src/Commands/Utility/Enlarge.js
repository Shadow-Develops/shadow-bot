const Command = require('../../Structures/Command');
const { MessageEmbed, Util } = require('discord.js');
const { parse } = require('twemoji-parser');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Make a emoji bigger.',
			category: 'Utility',
			aliases: ['bigemoji', 'embig', 'bigem'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		message.delete();
		const emoji = args[0];
		if (!emoji) return message.channel.send('No emoji provided!');

		const custom = Util.parseEmoji(emoji);

		if (custom.id) {
			const embed = new MessageEmbed()
				.setTitle(`Enlarged version of ${emoji}`)
				.setColor('#FFFF00')
				.setFooter({ text: `Requested By ${message.author.tag}` })
				.setImage(`https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? 'gif' : 'png'}`);
			return message.channel.send({ embeds: [embed] });
		} else {
			const parsed = parse(emoji, { assetType: 'png' });
			if (!parsed[0]) return message.channel.send('Invalid emoji!');
			const embed = new MessageEmbed()
				.setTitle(`Enlarged version of ${emoji}`)
				.setColor('#FFFF00')
				.setFooter({ text: `Requested By ${message.author.tag}` })
				.setImage(parsed[0].url);
			return message.channel.send({ embeds: [embed] });
		}
	}

};
