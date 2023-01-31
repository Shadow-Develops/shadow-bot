const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Un-Lockdown a channel so users can type.',
			category: 'Channels',
			usage: '(reason) \n**❯ Note:** It only effects @everyone tag.',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		const reason = args.join(' ');
		if (!this.client.lockit) this.client.lockit = [];
		if (reason) {
			message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: true }, [`Channel Lockdown Lifted | Reason: ${reason} | By: ${message.author.username}`]);
			message.channel.send(`**${message.author.username}** just lifted the lockdown for **${reason}**.`);
		} else {
			message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: true }, [`Channel Lockdown Lifted| By: ${message.author.username}`]);
			message.channel.send(`**${message.author.username}** just lifted the lockdown.`);
		}
	}

};
