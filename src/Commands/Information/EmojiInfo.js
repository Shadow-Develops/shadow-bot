const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ei', 'emoteinfo'],
			description: 'Displays information about the emoji you provide.',
			category: 'Information',
			usage: '<emoji>',
			guildOnly: true,
			args: true
		});
	}

	async run(message, [emote]) {
		message.delete();
		const regex = emote.replace(/^<a?:\w+:(\d+)>$/, '$1');

		const emoji = message.guild.emojis.cache.find((emj) => emj.name === emote || emj.id === regex);
		if (!emoji) return message.channel.send('Please provide a valid Custom Emoji from this guild.');

		const authorFetch = await emoji.fetchAuthor();
		const checkOrCross = (bool) => bool ? '☑️' : '❌';

		const embed = new MessageEmbed()
			.setTitle(`Emoji information for __${emoji.name.toLowerCase()}__`)
			.setColor('BLUE')
			.setThumbnail(emoji.url)
			.addField('General:',
				`**❯ ID:** ${emoji.id}
				**❯ URL:** [Link to Emoji](${emoji.url})
				**❯ Author:** ${authorFetch.tag} (${authorFetch.id})
				**❯ Time Created:** ${moment(emoji.createdTimestamp).format('LT')} ${moment(emoji.createdTimestamp).format('LL')} ${moment(emoji.createdTimestamp).fromNow()}
				**❯ Accessible by:** ${emoji.roles.cache.map((role) => role.name).join(', ') || 'Everyone'}`
			)
			.addField('Other:',
				`**❯ Requires Colons:** ${checkOrCross(emoji.requiresColons)}
				**❯ Deletable:** ${checkOrCross(emoji.deletable)}
				**❯ Animated:** ${checkOrCross(emoji.animated)}
				**❯ Managed:** ${checkOrCross(emoji.managed)}`
			);

		return message.channel.send({ embeds: [embed] });
	}

};
