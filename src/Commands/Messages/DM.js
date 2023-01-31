const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Make the bot DM a user.',
			category: 'Messages',
			usage: '<user> <message>',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

		if (!user) {
			return message.channel.send(
				`\`❌\` Please provide valid user mention or ID`
			);
		}

		const text = args.slice(1).join(' ');

		if (!text) { return message.channel.send(`\`❌\` Please provide valid text to send`); }

		user.send(text).catch(() => message.channel.send(`\`❌\` Cannot send message to this user`));

		message.reply(`\`✅\` Successfully sent a DM message to **${user.username}**`);
	}

};
