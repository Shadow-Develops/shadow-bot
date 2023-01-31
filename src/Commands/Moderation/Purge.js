const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['clear'],
			description: 'Delete 1 to 100 messages from a channel.',
			category: 'Moderation',
			usage: '<number of messages>',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();

		if (args[0] > 100) return message.reply('You can not purge more then 100 message.').then(msg => setTimeout(() => msg.delete(), 5000));
		message.channel.bulkDelete(args[0]).then(() => {
			message.channel.send(`:white_check_mark: Purged ${args[0]} messages.\nNote: Messages over 2 weeks old can not be purged.`).then(msg => setTimeout(() => msg.delete(), 10000));
		});
	}

};
