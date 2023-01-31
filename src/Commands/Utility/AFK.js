const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'The bot will put [AFK] in your name.',
			category: 'Utility',
			guildOnly: true
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message) {
		message.member.setNickname(`[AFK] ${message.member.displayName}`);
		message.reply('Please come back soon... :(').then(msg => setTimeout(() => {
			msg.delete();
			message.delete();
		}, 10000));
	}

};
