/* eslint-disable max-depth */
/* eslint-disable consistent-return */
/* eslint-disable complexity */
/* eslint-disable new-cap */
const Event = require('../../Structures/Event');
const db = require('quick.db');

module.exports = class extends Event {

	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);
		let prefix = '*';

		if (message.channel.type !== 'DM') {
			prefix = db.get(`prefix_${message.guild.id}`) !== null ? db.get(`prefix_${message.guild.id}`) : '*';
		}

		const usePrefix = message.content.match(mentionRegexPrefix) ?
			message.content.match(mentionRegexPrefix)[0] : prefix;

		if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is **\`${prefix}\`**.`);

		if (message.guild) {
			const channel = message.channel.id;
			const pin = new db.table('pintable');
			const pintable = pin.all();
			const msg = pin.get(`pinnedmessage_${message.guild.id}`);
			const chan = pin.get(`pinnedchannel_${message.guild.id}`);
			const msgID = pin.get(`pinnedmsgid_${message.guild.id}`);
			if (!message.content === `${this.client.prefix}unpin` || `${this.client.prefix}Unpin`) {
				if (chan === channel) {
					if (pintable.length) {
						for (const [, value] of Object.entries(pintable)) {
							const { ID } = value;
							if (ID === `pinnedmsgid_${message.guild.id}`) {
								const msgid = value.data.replace('"', '').replace('"', '');
								message.fetch(msgid);
							}
						}
					}

					if (this.client.channels.cache.get(channel).messages.fetch(msgID)) {
						this.client.channels.cache.get(chan).messages.fetch(msgID).then(msgDel => msgDel.delete());
						const newMessage = await message.channel.send(msg);
						const newMsgID = newMessage.id;
						pin.set(`pinnedmsgid_${message.guild.id}`, newMsgID);
					}
				}
			}
		}

		if (message.author.bot) return;

		if (!message.content.startsWith(usePrefix)) return;

		const [cmd, ...args] = message.content.slice(usePrefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
				return message.reply('Sorry, this command can only be used by the bot owners.');
			}

			if (command.guildOnly && !message.guild) {
				return message.reply('Sorry, this command can only be used within a Discord server.');
			}

			if (command.args && !args.length) {
				return message.reply(`Sorry, this command requires arguments to functions. Usage ${prefix}${command.usage ?
					command.usage : 'This command doesn`t have a usage format'}.`);
			}

			if (message.guild) {
				const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
				if (userPermCheck) {
					const missing = message.member.permissions.missing(userPermCheck);
					if (missing.length) {
						return message.reply(`You are missing \`${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))}\` permissions, and require them to execute this command.`);
					}
				}

				const botPermCheck = command.botPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPerms;
				if (botPermCheck) {
					const missing = message.guild.me.permissions.missing(botPermCheck);
					if (missing.length) {
						return message.reply(`The bot is missing \`${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))}\` permissions, and requires them to execute this command.`);
					}
				}
			}

			command.run(message, args);
		}
	}

};
