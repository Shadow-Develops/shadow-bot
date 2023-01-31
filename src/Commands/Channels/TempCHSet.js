const Command = require('../../Structures/Command');
const TempChannels = require('discord-temp-channels');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['tempchannelset'],
			description: 'Set the parent channel.\nWhen a user joins this channel, a temporary channel will be created in the defined category.',
			category: 'Channels',
			usage: '(category id)',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		// eslint-disable-next-line new-cap
		const tempCH = new db.table('tempchanneltable');
		const catID = args[0];
		if (!catID) return message.reply('You must enter a category ID.\nIf you don\'t want the channel created in a certain category type ``-none``.').then(msg => setTimeout(() => msg.delete(), 10000));

		const tempChannels = new TempChannels(this.client);
		if (tempChannels.channels.some((channel) => channel.channelId === message.member.voice.channel.id)) {
			return message.channel.send('Your voice channel is already a parent voice channel').then(msg => setTimeout(() => msg.delete(), 10000));
		}
		if (catID === '-none') {
			const options = {
				childAutoDelete: true,
				childAutoDeleteIfOwnerLeaves: true,
				childMaxUsers: 3,
				childBitrate: 64000,
				childFormat: (member, count) => `#${count} | ${member.user.username}'s lounge`
			};
			tempChannels.registerChannel(message.member.voice.channel.id, options);
			tempCH.set(`temp-channels_${message.guild.id}`, {
				channelId: message.member.voice.channel.id,
				options: options
			});
		} else {
			const options = {
				childCategory: catID,
				childAutoDelete: true,
				childAutoDeleteIfOwnerLeaves: true,
				childMaxUsers: 3,
				childBitrate: 64000,
				childFormat: (member, count) => `#${count} | ${member.user.username}'s lounge`
			};
			tempChannels.registerChannel(message.member.voice.channel.id, options);
			tempCH.set(`temp-channels_${message.guild.id}`, {
				channelId: message.member.voice.channel.id,
				options: options
			});
		}
		message.channel.send(':white_check_mark: Successfully set your current channel as the temporary channel parent.').then(msg => setTimeout(() => msg.delete(), 10000));
	}

};
