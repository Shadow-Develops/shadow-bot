const Command = require('../../Structures/Command');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['reactionroledelete', 'deleterr', 'deltereationrole'],
			description: 'This allows you to delete a reaction role.',
			category: 'Reaction Roles',
			usage: '<msg id> <role>',
			userPerms: ['MANAGE_ROLES'],
			botPerms: ['MANAGE_ROLES'],
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();

		// eslint-disable-next-line new-cap
		const rrDB = new db.table('rrTable');

		const msgID = args[0];
		if (!msgID) return message.reply('**Invalid Input** | Please enter a message ID.').then(msg => setTimeout(() => msg.delete(), 10000));
		const channel = rrDB.get(`channel_${message.guild.id}_${msgID}`);
		const emojiRole = rrDB.get(`emojiRole_${message.guild.id}_${msgID}`);
		if (channel === null) return message.reply('**Invalid Input** | Please enter a valid message ID.').then(msg => setTimeout(() => msg.delete(), 10000));

		const iRole = args.slice(1).join(' ');
		const ifRole = await message.guild.roles.cache.find(rl => rl.name === iRole) || message.guild.roles.cache.find(rl => rl.id === iRole);
		if (!ifRole) return message.reply('**Invalid Input** | You must enter a valid role.');

		for (const emRL of emojiRole) {
			const textSplit = emRL.split(/(?<=^\S+)\s/);
			const role = textSplit.slice(-1).pop();

			if (role === ifRole.name) {
				const emoji = await removeReaction(message, emojiRole, role);
				const newArr = await deleteItem(emojiRole, role);

				rrDB.set(`emojiRole_${message.guild.id}_${msgID}`, newArr);

				this.client.channels.cache.get(channel.id).messages.fetch(msgID)
					.then(msg => msg.reactions.cache.get(emoji.id || emoji).remove());

				message.reply(':white_check_mark: **Success** | The reaction roles will not longer be active, and the reaction has been removed from the message.')
					.then(msg => setTimeout(() => msg.delete(), 80000));
			}
		}
	}

};

function removeReaction(message, array, role) {
	const arr = filterItems(array, role);
	const string = arr.toString();
	const split = string.split(' ');
	const emoji = split[0];

	const regex = emoji.replace(/^<a?:\w+:(\d+)>$/, '$1');
	const fEmoji = message.guild.emojis.cache.find((emj) => emj.name === emoji || emj.id === regex);

	if (fEmoji !== undefined) {
		return fEmoji;
	} else {
		return emoji;
	}
}

function deleteItem(array, role) {
	const item = filterItems(array, role);
	const myIndex = array.indexOf(item.shift());
	// eslint-disable-next-line no-unused-expressions
	myIndex > -1 ? array.splice(myIndex, 1) : false;
	return array;
}

function filterItems(arr, query) {
	return arr.filter((el) => el.toLowerCase().indexOf(query.toLowerCase()) !== -1);
}
