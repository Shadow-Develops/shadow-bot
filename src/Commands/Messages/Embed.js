/* eslint-disable no-lonely-if */
/* eslint-disable max-depth */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
const Command = require('../../Structures/Command');
const { MessageEmbed, MessageCollector } = require('discord.js');
const { reddark } = require('../../../colours.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['announcement', 'messageembed', 'announceembed'],
			description: 'Turn a normal message into a fancy embed.',
			category: 'Messages',
			usage: '(advanced | a)',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true
		});
	}

	async run(message, args) {
		message.delete();

		if (args[0] === 'advanced' || args[0] === 'a') {
			advEmbed(message);
		} else {
			simpleEmbed(message);
		}
	}

};

async function simpleEmbed(message) {
	const filter = (msg) => msg.author.id === message.author.id;
	// eslint-disable-next-line max-len
	const colMSG = await message.channel.send(':pencil: **Simple Embed Creator!** Type `-cancel` to cancel.\nPlease enter the following information blow: `Channel - Title - #HexCode - Message`, and please keep all variables in the correct order.\nEx Input: `#general - Example Title - #fff - This is a message for the embed.`');
	const collector = new MessageCollector(message.channel, filter, { idle: 1500000 });

	const info = new Map();

	collector.on('collect', async msg => {
		if (msg.content.toLowerCase() === `-cancel`) {
			info.set('msg', 'cancel');
			collector.stop();
		}
		const { content } = await msg;
		await info.set('msg', content);
		await msg.delete().then(colMSG.delete());
		collector.stop();
	});

	collector.on('end', async () => {
		if (info.get('msg') === 'cancel') return message.channel.send(':x: **Embed Creation Cancelled.**');

		const newInfo = info.get('msg').split(' - ');

		let channel = newInfo.slice(0, 1).pop();
		const title = newInfo.slice(1, 2).pop();
		const color = newInfo.slice(2, 3).pop();
		const msg = newInfo.slice(3, 4).pop();

		const channelName = message.guild.channels.cache.find(rl => rl.name === channel);
		if (channelName !== undefined) {
			channel = channelName;
		} else {
			const channelId = message.guild.channels.cache.find(rl => rl.id === channel);
			if (channelId !== undefined) {
				channel = channelId;
			} else {
				const vID = channel.slice(2, 20);
				const channelId2 = message.guild.channels.cache.find(rl => rl.id === vID);
				if (channelId2 !== undefined) {
					channel = channelId2;
				}
			}
		}

		const embed = new MessageEmbed()
			.setTitle(title)
			.setColor(color)
			.setDescription(msg)
			.setFooter({ text: `Notification From ${message.author.tag}` })
			.setTimestamp();

		channel.send({ embeds: [embed] })
			.then(message.channel.send(':thumbsup: **Embed Created / Sent!**'));
	});
}

async function advEmbed(message) {
	const embedQuestions = {
		Questions: [
			'**What do you want the title to be?**\nType `##none` for no title.',
			'**What do you want the content of the embed to be?**',
			'**What color to you want the embed to be?**\nType `##none` for it to be set to default red.',
			'**Do you want a thumbnail for the embed?**\nType `##none` for no thumbail.',
			'**Do you want an image in the embed?**\nType `##none` for no image.',
			'**Do you want a with the message?**\nType `everyone` for *@*everyone, `here` for *@*here, and `none` for none. Other inputs will __not__ work.',
			'**What channel do you want the embed posted in?**\nType `##none` for it to be posted here.'
		]
	};
	const embeding = [];
	const cancelStat = new Map();
	const ping = new Map();

	// eslint-disable-next-line no-unused-vars
	for (const [key, value] of Object.entries(embedQuestions)) {
		try {
			await message.channel.send(':pencil: **Advanced Embed Creation Starting!** Type `##cancel` to exit.');

			cancelStat.set('stat', 'false');
			const filter = msg => msg.author.id === message.author.id;
			for (let i = 0, canceled = false; i < value.length && canceled === false; i++) {
				await message.channel.send(`\n${value[i]}`);
				await message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
					.then(async collected => {
						embeding[value[i]] = collected.first().content;

						if (collected.first().content.toLowerCase() === '##cancel') {
							await message.channel.send(':x: **Embed Creation Cancelled.**');
							canceled = true;
							if (canceled) {
								cancelStat.set('stat', 'true');
							}
						}
					}).catch(async () => {
						message.channel.send('**Timed Out.** | Embed will not be created..');
						canceled = true;
						if (canceled) {
							cancelStat.set('stat', 'true');
						}
					});
			}

			const cancel = cancelStat.get('stat');
			if (cancel === 'false') {
				await message.channel.send(':thumbsup: **Embed Complete / Sent!**');
			}
		} catch (err) {
			console.error(err);
		}
	}

	const cancel = cancelStat.get('stat');
	if (cancel === 'false') {
		const sayEmbed = new MessageEmbed()
			.setTimestamp()
			.setFooter({ text: `Notification From ${message.author.username}` });

		for (const [keyA, valueA] of Object.entries(embeding)) {
			// eslint-disable-next-line max-len
			const expression = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\\/]))?/;
			const regex = new RegExp(expression);
			if (keyA === '**What do you want the title to be?**\nType `##none` for no title.') {
				if (valueA.toLowerCase() !== '##none') {
					sayEmbed.setTitle(valueA);
				}
			}
			if (keyA === '**What do you want the content of the embed to be?**') {
				sayEmbed.setDescription(valueA);
			}
			if (keyA === '**What color to you want the embed to be?**\nType `##none` for it to be set to default red.') {
				if (valueA.toLowerCase() !== '##none') {
					sayEmbed.setColor(valueA);
				} else {
					sayEmbed.setColor(reddark);
				}
			}
			if (keyA === '**Do you want a thumbnail for the embed?**\nType `##none` for no thumbail.') {
				if (valueA.match(regex) && valueA.toLowerCase() !== '##none') {
					sayEmbed.setThumbnail(valueA);
				}
			}
			if (keyA === '**Do you want an image in the embed?**\nType `##none` for no image.') {
				if (valueA.match(regex) && valueA.toLowerCase() !== '##none') {
					sayEmbed.setImage(valueA);
				}
			}
			if (keyA === '**Do you want a with the message?**\nType `everyone` for *@*everyone, `here` for *@*here, and `none` for none. Other inputs will __not__ work.') {
				if (valueA.toLowerCase() === 'everyone') {
					ping.set('type', '@everyone');
				} else if (valueA.toLowerCase() === 'here') {
					ping.set('type', '@here');
				} else {
					ping.set('type', 'none');
				}
			}
			if (keyA === '**What channel do you want the embed posted in?**\nType `##none` for it to be posted here.') {
				if (valueA.toLowerCase() !== '##none') {
					const pinger = ping.get('type');
					const channelName = message.guild.channels.cache.find(rl => rl.name === valueA);
					if (channelName !== undefined) {
						if (pinger === '@everyone') {
							channelName.send({ content: `@everyone`, embeds: [sayEmbed] });
						} else if (pinger === '@here') {
							channelName.send({ content: `@here`, embeds: [sayEmbed] });
						} else {
							channelName.send({ embeds: [sayEmbed] });
						}
					} else {
						const channelId = message.guild.channels.cache.find(rl => rl.id === valueA);
						if (channelId !== undefined) {
							if (pinger === '@everyone') {
								channelId.send({ content: `@everyone`, embeds: [sayEmbed] });
							} else if (pinger === '@here') {
								channelId.send({ content: `@here`, embeds: [sayEmbed] });
							} else {
								channelId.send({ embeds: [sayEmbed] });
							}
						} else {
							const vID = valueA.slice(2, 20);
							const channelId2 = message.guild.channels.cache.find(rl => rl.id === vID);
							if (pinger === '@everyone') {
								channelId2.send({ content: `@everyone`, embeds: [sayEmbed] });
							} else if (pinger === '@here') {
								channelId2.send({ content: `@here`, embeds: [sayEmbed] });
							} else {
								channelId2.send({ embeds: [sayEmbed] });
							}
						}
					}
				} else {
					const pinger = ping.get('type');
					if (pinger === '@everyone') {
						message.channel.send({ content: `@everyone`, embeds: [sayEmbed] });
					} else if (pinger === '@here') {
						message.channel.send({ content: `@here`, embeds: [sayEmbed] });
					} else {
						message.channel.send({ embeds: [sayEmbed] });
					}
				}
			}
		}
	}
}
