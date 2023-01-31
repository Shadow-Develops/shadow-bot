/* eslint-disable new-cap */
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Rename a ticket',
			category: 'Tickets',
			usage: '<new name>',
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		if (!args[0]) return message.channel.send(`Please specify a channel name. Use a \`-\` at the start to add to the existing name.`).then(msg => setTimeout(() => msg.delete(), 8000));
		const channelRename = args.join('-');
		if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Your not in a ticket channel.`).then(msg => setTimeout(() => msg.delete(), 10000));
		if (channelRename.startsWith(`-`)) {
			message.channel.setName(`${message.channel.name}${channelRename}`);
			message.channel.send(`<@${message.author.id}> Renamed the channel to: *${message.channel.name}${channelRename}*`);
		} else {
			message.channel.setName(`ticket-${channelRename}`);
			message.channel.send(`<@${message.author.id}> Renamed the channel to: *ticket-${channelRename}*`);
		}
	}

};
