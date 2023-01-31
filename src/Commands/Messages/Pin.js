/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Pin a message in the channel.',
			category: 'Messages',
			usage: '<message>',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		try {
			message.delete();
			const argsresult = args.join(' ');
			if (!argsresult) return message.channel.send(`${message.author}, Invalid Usage. | You must state a message to pin.`).then(msg => setTimeout(() => msg.delete(), 5000));
			const pin = new db.table('pintable');
			const channel = message.channel.id;
			const oldMessage = pin.get(`pinnedmsgid_${message.guild.id}`);
			if (oldMessage) {
				await pin.delete(`pinnedmessage_${message.guild.id}`);
				await pin.delete(`pinnedmsgid_${message.guild.id}`);
				pin.set(`pinnedmessage_${message.guild.id}`, argsresult);
				const newMessage = await message.channel.send(argsresult);
				const newMsgID = newMessage.id;
				pin.set(`pinnedmsgid_${message.guild.id}`, newMsgID);
			} else {
				pin.set(`pinnedmessage_${message.guild.id}`, argsresult);
				pin.set(`pinnedchannel_${message.guild.id}`, channel);
				const sentMessage = await message.channel.send(argsresult);
				const msgID = sentMessage.id;
				pin.set(`pinnedmsgid_${message.guild.id}`, msgID);
			}
		} catch (err) {
			console.log(err);
		}
	}

};
