const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'The bot will remove [AFK] in your name and remove it when you send a message.',
			category: 'Utility',
			aliases: ['return', 'back'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message) {
		message.member.setNickname(message.member.displayName.slice(6));
		message.reply('Welcome back!').then(msg => setTimeout(() => {
			msg.delete();
			message.delete();
		}, 10000));
	}

};
