const Command = require('../../Structures/Command');
const ms = require('ms');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['countdown'],
			description: 'Start a timer.',
			category: 'Utility',
			usage: '<time(seconds | minutes | hours)>',
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		const Timer = args[0];
		if (!args[0]) {
			return message.channel.send('Please enter a period of time, with either `s, m or h` at the end!').then(msg => setTimeout(() => msg.delete(), 10000));
		}
		if (args[0] <= 0) {
			return message.channel.send('Please enter a period of time, with either `s, m or h` at the end!').then(msg => setTimeout(() => msg.delete(), 10000));
		}
		message.channel.send(`:white_check_mark: Timer has been set for: ${ms(ms(Timer), { long: true })}`).then(msg => setTimeout(() => msg.delete(), 25000));
		setTimeout(() => {
			message.channel.send(`Timer has ended, it lasted: ${ms(ms(Timer), { long: true })} ${message.author.toString()}`).then(msg => setTimeout(() => msg.delete(), 30000));
		}, ms(Timer));
	}

};
