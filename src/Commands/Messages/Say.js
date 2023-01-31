const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['speak'],
			description: 'Make the bot say something.',
			category: 'Messages',
			usage: '(channel) <message>',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		let text = args.join(' ');
		message.delete();
		const channelName = message.guild.channels.cache.find(rl => rl.name === args[0]);
		if (channelName !== undefined) {
			text = args.slice(1).join(' ');
			channelName.send(text);
		} else {
			const channelId = message.guild.channels.cache.find(rl => rl.id === args[0]);
			if (channelId !== undefined) {
				text = args.slice(1).join(' ');
				channelId.send(text);
			} else {
				const vID = args[0].slice(2, 20);
				const channelId2 = message.guild.channels.cache.find(rl => rl.id === vID);
				if (channelId2 !== undefined) {
					text = args.slice(1).join(' ');
					channelId2.send(text);
				} else {
					text = args.join(' ');
					message.channel.send(text);
				}
			}
		}
	}

};
