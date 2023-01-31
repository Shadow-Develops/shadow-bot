const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['slow'],
			description: 'Change the slowmode setting for a channel',
			category: 'Channels',
			usage: '<time>\n**❯ Note:** Input 0 as the time to disable.',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		if (!args[0]) return message.channel.send(`You did not specify the time in seconds you would like to set it to.`);
		if (isNaN(args[0])) return message.channel.send(`That is not a number! Please use a number Ex. 5`);
		message.channel.setRateLimitPerUser(args[0]).then(message.channel.send(`**${message.author.username}** has enabled a slowmode of ${args[0]} seconds.`));
	}

};
