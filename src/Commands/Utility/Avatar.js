const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Display a users avatar.',
			category: 'Utility',
			guildOnly: true
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, [target]) {
		message.delete();
		const msg = await message.channel.send('Generating avatar...');

		const member = message.mentions.members.last() || message.guild.members.cache.get(target) || message.member;

		const embed = new MessageEmbed()

			.setImage(member.user.displayAvatarURL({ dynamic: true }))
			.setColor('00ff00')
			.setTitle('Avatar')
			.setFooter({ text: `Searched by ${message.author.tag}` });

		message.channel.send({ embeds: [embed] });


		msg.delete();
	}

};
