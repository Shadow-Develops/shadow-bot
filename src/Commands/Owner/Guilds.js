const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Command = require('../../Structures/Command');

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
			description: 'This displays all guilds the bot is in.',
			category: 'Owner',
			aliases: ['guildlist', 'serverlist'],
			guildOnly: true,
			ownerOnly: true
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message) {
		message.delete();
		const guilds = [...this.client.guilds.cache.values()];

		const invites = [];
		for (const [, guild] of this.client.guilds.cache) {
			let invite = 'No Invites';
			const fetch = await guild.invites.fetch().catch(() => undefined);

			if (fetch && fetch.size) {
				invite = fetch.first().url;
				invites.push({ name: guild.name, invite });
				continue;
			}

			for (const [, channel] of guild.channels.cache) {
				if (!invite && channel.createInvite) {
					const attempt = await channel.createInvite().catch(() => undefined);

					if (attempt) {
						invite = attempt.url;
					}
				}
			}

			invites.push({ name: guild.name, invite });
		}

		const generateEmbed = start => {
			const current = guilds.slice(start, start + 1);

			const embed = new MessageEmbed()
				.setAuthor({ name: `Showing ${start + current.length} out of ${guilds.length} guild(s).` })
				.setTitle('Guild Information')
				.setColor('RED')
				.setTimestamp()
				.setFooter({ text: `© ${new Date().getFullYear()} Shadow Development` });

			current.forEach(async gl => {
				let invite = 'N/A';
				for (const inv of invites) {
					const invName = inv.name;
					const invInvite = inv.invite;
					if (invName === gl.name) invite = invInvite;
				}

				const roles = gl.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
				const members = gl.members.cache;
				const channels = gl.channels.cache;
				const emojis = gl.emojis.cache;
				const owner = this.client.users.cache.find(user => user.id === gl.ownerId);
				embed.addField('General',
					`**❯ Name:** ${gl.name}
					**❯ ID:** ${gl.id}
					**❯ Invite:** ${invite}
					**❯ Locale:** ${locales[gl.preferredLocale]}
					**❯ Boost Tier:** ${gl.premiumTier && gl.premiumTier !== 'NONE' ? `Tier ${gl.premiumTier}` : 'None'}
					**❯ Partnered:** ${message.guild.partnered ? 'Yes' : 'No'}
					**❯ Verified:** ${message.guild.verified ? 'Yes' : 'No'}
					**❯ Explicit Filter:** ${filterLevels[gl.explicitContentFilter]}
					**❯ Verification Level:** ${verificationLevels[gl.verificationLevel]}
					**❯ Time Created:** ${moment(gl.createdTimestamp).format('LT')} ${moment(gl.createdTimestamp).format('LL')} ${moment(gl.createdTimestamp).fromNow()}

					**❯ Owner:**
					\u3000 Tag: ${owner}
					\u3000 ID: ${owner}
					\u3000 Mention: <@${owner}>
					\u200b`
				)
					.addField('Statistics',
						`**❯ Role Count:** ${roles.length}
						**❯ Emoji Count:** ${emojis.size}
						\u3000 **❯ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}
						\u3000 **❯ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}
						**❯ Member Count:** ${gl.memberCount}
						\u3000 **❯ Humans:** ${members.filter(member => !member.user.bot).size + 1}
						\u3000 **❯ Bots:** ${members.filter(member => member.user.bot).size + 1}
						**❯ Text Channels:** ${channels.filter(channel => channel.type === 'GUILD_TEXT').size}
						**❯ Voice Channels:** ${channels.filter(channel => channel.type === 'GUILD_VOICE').size}
						**❯ Boost Count:** ${gl.premiumSubscriptionCount || '0'}
						\u200b`
					);
			});
			return embed;
		};
		const { author } = message;

		message.channel.send({ embeds: [generateEmbed(0)] }).then(msg => {
			if (guilds.length <= 1) return;
			msg.react('➡️');
			const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id;
			const collector = msg.createReactionCollector({
				filter,
				time: 100000
			});

			let currentIndex = 0;
			collector.on('collect', reaction => {
				msg.reactions.removeAll().then(async () => {
					// eslint-disable-next-line no-unused-expressions
					reaction.emoji.name === '⬅️' ? currentIndex -= 1 : currentIndex += 1;
					msg.edit({ embeds: [generateEmbed(currentIndex)] });
					if (currentIndex !== 0) await msg.react('⬅️');
					if (currentIndex + 1 < guilds.length) msg.react('➡️');
				});
			});
		});
	}

};
