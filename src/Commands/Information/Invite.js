const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['supportserver', 'add', 'addme', 'support'],
			description: 'Get an invite for the bot or to the support server.',
			category: 'Information'
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message) {
		message.delete();
		const embed = new MessageEmbed()
			.setTitle('Squad Bot Invite / Support Server Invite')
			.setColor('#9F1010')
			.addField('**❯ Invite Link**', '[Click here to invite Squad Bot.](https://discord.com/oauth2/authorize?client_id=740023863479631943&permissions=1513938742527&scope=bot&response_type=code&redirect_uri=https://bots.shadowdevs.com/thanks)')
			.addField('**❯ Support Server**', '[Click to join the support server.](https://discord.gg/fVrRa8z)')
			.setFooter({ text: '© 2020 - 2022 Shadow Development' })
			.setTimestamp();

		message.channel.send({ embeds: [embed] });
	}

};
