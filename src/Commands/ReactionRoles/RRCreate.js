/* eslint-disable max-depth */
/* eslint-disable complexity */
const { MessageEmbed, MessageCollector } = require('discord.js');
const Command = require('../../Structures/Command');
// eslint-disable-next-line camelcase
const { blue_light } = require('../../../colours.json');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['reactionrolecreate', 'createrr', 'createreationrole'],
			description: 'This allows you to create your reaction role message.',
			category: 'Reaction Roles',
			userPerms: ['MANAGE_ROLES'],
			botPerms: ['MANAGE_ROLES'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message) {
		message.delete();

		// eslint-disable-next-line new-cap
		const rrDB = new db.table('rrTable');

		const embed = new MessageEmbed()
			.setTimestamp()
			.setColor(blue_light)
			.setFooter({ text: `© ${new Date().getFullYear()} Shadow Development` });

		const rrEmbed = new MessageEmbed()
			.setTimestamp()
			.setFooter({ text: `© ${new Date().getFullYear()} Shadow Development` });

		const embedQuestions = {
			Questions: [
				'**Which channel would you like the message to be in?**',
				// eslint-disable-next-line max-len
				'**What would you like the message to say?** Use a ``|`` to separate the title from the description, like so\n```\nThis is a title | this is the description\n```\nYou can also type ``{roles}`` to have it replaced with a list of each emoji and its associated role.',
				'**Would you like the message to have a color?** Respond with the hex code or \'none\' to skip.\nCheck out [https://htmlcolorcodes.com/color-picker/] if you need help with hex codes.'
			]
		};
		const embeding = [];
		const roles = [];
		const endStat = new Map();
		const rr = new Map();
		const rrDecp = new Map();
		const filter = (msg) => msg.author.id === message.author.id;

		for (const [, value] of Object.entries(embedQuestions)) {
			try {
				endStat.set('stat', 'false');
				for (let i = 0, canceled = false; i < value.length && canceled === false; i++) {
					await message.channel.send(`\n${value[i]}`);
					await message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
						.then(async collected => {
							embeding[value[i]] = collected.first().content;
						}).catch(async () => {
							message.channel.send('**Timed Out.** | Reaction Role will not be created.');
							canceled = true;
						});
				}
			} catch (err) {
				console.error(err);
			}
		}

		// eslint-disable-next-line max-len
		await message.channel.send('**Next up we will add roles and emojies.** You have 25 minutes before the collection will end and message sent.\nThe format for adding roles is emoji then the name of the role. When you\'re done, type \'done\'\n**EX:**```\n:smile: nice person\n```');
		const collector = new MessageCollector(message.channel, filter, { idle: 1500000 });

		collector.on('collect', async cMSG => {
			const contS = cMSG.content.split(/(?<=^\S+)\s/);
			const rLN = contS.slice(-1).pop();
			if (cMSG.content !== 'done') {
				const roleName = await message.guild.roles.cache.find(rl => rl.name === rLN);
				if (roleName) {
					await cMSG.react('✅');
					roles.push(cMSG.content);
				}
				if (!roleName) message.reply(`I couldn't find a role with the name \`${contS}\`. The format is **\`:emoji: role\`** and make sure the role actually exists.`);
			}

			if (cMSG.content === 'done') {
				collector.stop();
			}
		});


		for (const [keyA, valueA] of Object.entries(embeding)) {
			// eslint-disable-next-line max-len
			if (keyA === '**Which channel would you like the message to be in?**') {
				const channelName = message.guild.channels.cache.find(ch => ch.name === valueA);
				const channelId = message.guild.channels.cache.find(ch => ch.id === valueA);
				if (channelName !== undefined) {
					rr.set('channel', channelName);
				} else if (channelId !== undefined) {
					rr.set('channel', channelId);
				} else {
					const valSlince = valueA.slice(2, 20);
					const chID = message.guild.channels.cache.find(ch => ch.id === valSlince);
					rr.set('channel', chID);
				}
			}
			// eslint-disable-next-line max-len
			if (keyA === '**What would you like the message to say?** Use a ``|`` to separate the title from the description, like so\n```\nThis is a title | this is the description\n```\nYou can also type ``{roles}`` to have it replaced with a list of each emoji and its associated role.') {
				const vContent = valueA.split('|');
				rrEmbed.setTitle(vContent.slice(0, 1).toString());
				const descp = vContent.slice(1, 2).join('');
				if (descp.includes('{roles}')) {
					rrDecp.set('text', descp);
					rrDecp.set('rStat', 'true');
				} else {
					rrEmbed.setDescription(descp);
				}
			}
			// eslint-disable-next-line max-len
			if (keyA === '**Would you like the message to have a color?** Respond with the hex code or \'none\' to skip.\nCheck out [https://htmlcolorcodes.com/color-picker/] if you need help with hex codes.') {
				if (valueA !== 'none') {
					if (valueA.startsWith('#')) {
						rrEmbed.setColor(valueA);
					} else {
						rrEmbed.setColor(`#${valueA}`);
					}
				}
			}
		}

		collector.on('end', async () => {
			embed.setTitle(`${roles.length} Reaction Roles Created`);

			const rrList = [];
			if (rrDecp.get('rStat') === 'true') {
				const txt = rrDecp.get('text');
				for (const rroles of roles) {
					const newrroles = rroles.replace(' ', ' = ');
					rrList.push(newrroles);
				}

				const newDescp = txt.replace('{roles}', rrList.join('\n'));
				rrEmbed.setDescription(newDescp);
			}

			const rrChannel = rr.get('channel');
			const rrMSG = await rrChannel.send({ embeds: [rrEmbed] }).catch(() => message.reply('**Invalid Channel** | Please Redo the command.'));
			const rrmsgID = rrMSG.id;
			rrDB.set(`emojiRole_${message.guild.id}_${rrmsgID}`, roles);
			rrDB.set(`channel_${message.guild.id}_${rrmsgID}`, rrChannel);
			embed.addField('Message ID', rrMSG.id)
				.addField('Go to Message', `[Click Here](${rrMSG.url})`);

			for (const react of roles) {
				const textSplit = react.split(/(?<=^\S+)\s/);
				const emoji = textSplit[0];

				const regex = emoji.replace(/^<a?:\w+:(\d+)>$/, '$1');
				const fEmoji = message.guild.emojis.cache.find((emj) => emj.name === emoji || emj.id === regex);
				const dbEmojis = rrDB.get(`emojis_${message.guild.id}_${rrmsgID}`);
				if (fEmoji) {
					rrMSG.react(fEmoji);
					if (dbEmojis !== undefined) {
						rrDB.push(`emojis_${message.guild.id}_${rrmsgID}`, fEmoji);
					} else {
						rrDB.push(`emojis_${message.guild.id}_${rrmsgID}`, fEmoji);
					}
				} else {
					rrMSG.react(emoji);
					if (dbEmojis !== undefined || null) {
						rrDB.push(`emojis_${message.guild.id}_${rrmsgID}`, emoji);
					} else {
						rrDB.push(`emojis_${message.guild.id}_${rrmsgID}`, emoji);
					}
				}
			}

			message.channel.send({ embeds: [embed] });
		});
	}

};
