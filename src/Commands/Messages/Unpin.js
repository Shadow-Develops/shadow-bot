/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Unpin a message.',
			category: 'Messages',
			usage: '<message>',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message) {
		try {
			message.delete();
			const pin = new db.table('pintable');
			pin.get(`pinnedmessage_${message.guild.id}`);
			pin.get(`pinnedchannel_${message.guild.id}`);
			pin.get(`pinnedmsgid_${message.guild.id}`);

			pin.delete(`pinnedmessage_${message.guild.id}`);
			pin.delete(`pinnedchannel_${message.guild.id}`);
			pin.delete(`pinnedmsgid_${message.guild.id}`);

			message.channel.send(`***Message has been unpinned***`).then(msg => setTimeout(() => msg.delete(), 10000));
		} catch (err) {
			console.log(err);
		}
	}

};
