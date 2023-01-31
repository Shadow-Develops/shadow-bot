const Command = require('../../Structures/Command');
const fetch = require('node-fetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['discordjs', 'discdocs'],
			description: 'Displays information from the discord.js documentation.',
			category: 'Information',
			usage: '<searchQuery>',
			botPerms: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
			args: true
		});
	}

	async run(message, ...query) {
		const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`;

		const docFetch = await fetch(url);
		const embed = await docFetch.json();

		if (!embed || embed.error) {
			return message.reply(`"${query}" couldn't be located within discord.js documentation (<https://discord.js.org/>).`);
		}
		message.delete();

		if (!message.guild) {
			return message.channel.send({ embeds: [embed] });
		}

		const msg = await message.channel.send({ embeds: [embed] });
		msg.react('🗑️');

		let react;
		const filter = (reaction, user) => reaction.emoji.name === '🗑️' && user.id === message.author.id;
		try {
			react = await msg.awaitReactions({
				filter,
				max: 1, time: 10000, errors: ['time']
			});
		} catch (error) {
			msg.reactions.removeAll();
		}

		if (react && react.first()) msg.delete();

		return message;
	}

};
