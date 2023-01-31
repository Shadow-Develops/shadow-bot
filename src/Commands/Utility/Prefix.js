const Command = require('../../Structures/Command');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Change the bot prefix.',
			category: 'Utility',
			usage: '<new prefix>',
			userPerms: ['MANAGE_GUILD'],
			guildOnly: true,
			ownerOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		try {
			message.delete();
			if (!args[0]) return message.reply(`Invalid Usage. | You must state a new prefix.`).then(msg => setTimeout(() => msg.delete(), 5000));

			db.set(`prefix_${message.guild.id}`, args[0]);

			const embed = new MessageEmbed()
				.setTitle(`Prefix Changed!`)
				.setColor('GREEN')
				.setFooter({ text: `Changed by: ${message.author.tag}` })
				.setTimestamp()
				.setDescription(`:white_check_mark: | New prefix is **${args[0]}**`);

			message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 100000));
		} catch (err) {
			console.log(err);
		}
	}

};
