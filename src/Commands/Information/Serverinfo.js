const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const locales = {
	'en-US': 'English (United States)',
	'en-GB': 'English (Great Britain)',
	de: 'German',
	fr: 'French',
	ru: 'Russian'
};

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['server', 'guild', 'guildinfo'],
			description: 'Displays information about the server.',
			category: 'Information',
			guildOnly: true
		});
	}

	async run(message) {
		message.delete();
		const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);
		const members = message.guild.members.cache;
		const channels = message.guild.channels.cache;
		const emojis = message.guild.emojis.cache;
		const stickers = message.guild.stickers.cache;
		const owner = message.guild.members.cache.find(mm => mm.id === message.guild.ownerId);

		const embed = new MessageEmbed()
			.setDescription(`**Guild information for __${message.guild.name}__**`)
			.setColor('BLUE')
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.addField('General',
				`**❯ Name:** ${message.guild.name.toString()}
				**❯ ID:** ${message.guild.id.toString()}
				**❯ Owner:** ${owner.user.tag} (${owner.id.toString()})
				**❯ Locale:** ${locales[message.guild.preferredLocale]}
				**❯ Boost Tier:** ${message.guild.premiumTier && message.guild.premiumTier !== 'NONE' ? `Tier ${message.guild.premiumTier}` : 'None'}
				**❯ Partnered:** ${message.guild.partnered ? 'Yes' : 'No'}
				**❯ Verified:** ${message.guild.verified ? 'Yes' : 'No'}
				**❯ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}
				**❯ Verification Level:** ${verificationLevels[message.guild.verificationLevel]}
				**❯ Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}
				\u200b`
			)
			.addField('Statistics',
				`**❯ Role Count:** ${roles.length}
				**❯ Member Count:** ${message.guild.memberCount}
				\u3000 **❯ Bots:** ${members.filter(member => member.user.bot).size + 1}
				\u3000 **❯ Humans:** ${members.filter(member => !member.user.bot).size + 1}
				**❯ Emoji Count:** ${emojis.size}
				\u3000 **❯ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}
				\u3000 **❯ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}
				**❯ Sticker Count:** ${stickers.size}
				\u3000 **❯ Regular Sticker Count:** ${stickers.filter(sticker => !sticker.animated).size}
				\u3000 **❯ Animated Sticker Count:** ${stickers.filter(sticker => sticker.animated).size}
				**❯ Text Channels:** ${channels.filter(channel => channel.type === 'GUILD_TEXT').size}
				**❯ Voice Channels:** ${channels.filter(channel => channel.type === 'GUILD_VOICE').size}
				**❯ Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}
				\u200b`
			)
			.addField('Presence',
				`**❯ Online:** ${members.filter(member => member.guild.presences.status === 'online').size}
				**❯ Idle:** ${members.filter(member => member.guild.presences.status === 'idle').size}
				**❯ Do Not Disturb:** ${members.filter(member => member.guild.presences.status === 'dnd').size}
				**❯ Offline:** ${members.filter(member => member.guild.presences.status === 'offline').size}
				\u200b`
			)
			.addField(`Roles [${roles.length}]`, roles.length < 30 ? roles.join(', ') : roles.length > 30 ? this.client.utils.trimArray(roles).toString() : 'None')
			.setTimestamp();
		message.channel.send({ embeds: [embed] });
	}

};
