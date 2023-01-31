const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Lockdown a channel so users can\'t type.',
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
			message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }, [`Channel Lockdown | Reason: ${reason} | By: ${message.author.username}`]);
			message.channel.send(`**${message.author.username}** just locked the channel down for **${reason}**. Don't worry, it will soon open again so be patient.`);
		} else {
			message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }, [`Channel Lockdown | By: ${message.author.username}`]);
			message.channel.send(`**${message.author.username}** just locked the channel down. Don't worry, it will soon open again so be patient.`);
		}
	}

};
