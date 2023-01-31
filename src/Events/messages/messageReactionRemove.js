/* eslint-disable new-cap */
const Event = require('../../Structures/Event');
const db = require('quick.db');

module.exports = class extends Event {

	async run(reaction, user) {
		if (user.bot) return;
		if (!reaction.message.guild) return;
		if (reaction.message.partial) await reaction.message.fetch();
		if (reaction.partial) await reaction.fetch();

		const rrDB = new db.table('rrTable');

		const channel = rrDB.get(`channel_${reaction.message.guild.id}_${reaction.message.id}`);
		const emojis = rrDB.get(`emojis_${reaction.message.guild.id}_${reaction.message.id}`);
		const emojiRole = rrDB.get(`emojiRole_${reaction.message.guild.id}_${reaction.message.id}`);

		const rMember = reaction.message.guild.members.cache.find(mm => mm.user.id === user.id);

		async function roleLink(rEmoji) {
			for (const emRL of emojiRole) {
				const textSplit = emRL.split(/(?<=^\S+)\s/);
				const emoji = textSplit[0];
				const eSplit = emoji.split(':')[1];
				const role = textSplit.slice(-1).pop();
				const fRole = await reaction.message.guild.roles.cache.find(rl => rl.name === role);

				if (emoji === rEmoji) {
					if (textSplit[1] === role) {
						if (rMember.roles.cache.has(fRole.id)) await rMember.roles.remove(fRole.id);
					}
				} else if (eSplit === rEmoji) {
					if (textSplit[1] === role) {
						if (rMember.roles.cache.has(fRole.id)) await rMember.roles.remove(fRole.id);
					}
				}
			}
		}

		if (channel) {
			for (const emoji of emojis) {
				if (reaction.emoji.name === emoji) {
					roleLink(emoji);
				} else if (reaction.emoji.name === emoji.name) {
					roleLink(emoji.name);
				}
			}
		}
	}

};
