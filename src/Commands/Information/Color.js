const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Get information about a color hex.',
			category: 'Information',
			usage: '<text>',
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		const input = args.join('');
		if (input.startsWith('#')) return message.channel.send(`${message.author}, Please input a valid hex code. (No "#" is required at the front.)`);
		const response = await fetch(`https://api.alexflipnote.dev/colour/${input}`);
		const colour = await response.json();
		if (colour.code === 400) return message.channel.send(`${message.author}, ${colour.description}.`);

		const colorEmbed = new MessageEmbed()
			.setTitle(`${colour.name.toString()} (#${input}) Color Information`)
			.setColor(`#${input}`)
			.addFields(
				{ name: 'RGB Values:', value: colour.rgb.toString(), inline: true },
				{ name: 'Brightness:', value: colour.brightness.toString(), inline: true },
				{ name: 'Shades:', value: `#${colour.shade.join(', #').toString()}` },
				{ name: 'Tints:', value: `#${colour.tint.join(', #').toString()}` }

			)
			.setThumbnail(colour.image)
			.setImage(colour.image_gradient)
			.setFooter({ text: `Requested By ${message.author.tag}` })
			.setTimestamp();

		message.channel.send({ embeds: [colorEmbed] });
	}

};
