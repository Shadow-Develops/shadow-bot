const Command = require('../../Structures/Command');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['tempchanneldelte'],
			description: 'Delete the parent channel.\nWhen a user joins this channel, a temporary channel will be created in the defined category.',
			category: 'Channels',
			usage: '(category id)',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message) {
		// eslint-disable-next-line new-cap
		const tempCH = new db.table('tempchanneltable');
		message.delete();
		tempCH.delete(`temp-channels_${message.guild.id}`);
		message.channel.send(':white_check_mark: Successfully deleted this server\'s temporary channel parent.').then(msg => setTimeout(() => msg.delete(), 10000));
	}

};
