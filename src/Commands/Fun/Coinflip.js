const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Flip a coin.',
			category: 'Fun',
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message) {
		const random = Math.floor(Math.random() * Math.floor(2));
		if (random === 0) {
			message.reply('It is **Heads**!');
		} else {
			message.reply('It is **Tails**!');
		}
	}

};
