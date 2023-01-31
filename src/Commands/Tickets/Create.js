/* eslint-disable new-cap */
/* eslint-disable max-depth */
/* eslint-disable complexity */
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const Command = require('../../Structures/Command');
// eslint-disable-next-line camelcase
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ticketcreate', 'ticketembed'],
			description: 'This allows you to create a Ticket Embed.',
			category: 'Tickets',
			userPerms: ['MANAGE_CHANNELS', 'MANAGE_GUILD'],
			botPerms: ['MANAGE_CHANNELS'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message) {
		message.delete();

		const ticketEmbed = new db.table('ticketembed');

		const ticEmbed = new MessageEmbed()
			.setTimestamp()
			.setFooter({ text: `© ${new Date().getFullYear()} Shadow Development` });

		const embedQuestions = {
			Questions: [
				'**Which channel would you like the message to be in?**',
				'**What would you like the message to say?** Use a ``|`` to separate the title from the description, like so\n```\nThis is a title | this is the description\n```',
				'**Would you like the message to have a color?** Respond with the hex code or \'none\' to skip.\nCheck out [https://htmlcolorcodes.com/color-picker/] if you need help with hex codes.',
				// eslint-disable-next-line max-len
				'**What style (color) would you like the button?** Respond with \'none\' for grey.\nOptions: `PRIMARY` = Blurple, `SECONDARY` = Grey, `SUCCESS` = Green, `DANGER` = Red',
				'**What would you like the button label to be?** Respond with \'none\' to use default: ️Open Ticket',
				'**What emoji would you like in the button?** Respond with \'none\' to use default: ️:tickets:'
			]
		};
		const embeding = [];
		const endStat = new Map();
		const tic = new Map();
		const filter = (msg) => msg.author.id === message.author.id;

		// eslint-disable-next-line no-unused-vars
		for (const [key, value] of Object.entries(embedQuestions)) {
			try {
				endStat.set('stat', 'false');
				for (let i = 0, canceled = false; i < value.length && canceled === false; i++) {
					await message.channel.send(`\n${value[i]}`);
					await message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
						.then(async collected => {
							embeding[value[i]] = collected.first().content;
						}).catch(async () => {
							message.channel.send('**Timed Out.** | Ticket Embed will not be created.');
							canceled = true;
						});
				}
			} catch (err) {
				console.error(err);
			}
		}

		for (const [keyA, valueA] of Object.entries(embeding)) {
			// eslint-disable-next-line max-len
			if (keyA === '**Which channel would you like the message to be in?**') {
				const channelName = message.guild.channels.cache.find(ch => ch.name === valueA);
				const channelId = message.guild.channels.cache.find(ch => ch.id === valueA);
				if (channelName !== undefined) {
					tic.set('channel', channelName);
				} else if (channelId !== undefined) {
					tic.set('channel', channelId);
				} else {
					const valSlince = valueA.slice(2, 20);
					const chID = message.guild.channels.cache.find(ch => ch.id === valSlince);
					tic.set('channel', chID);
				}
			}
			// eslint-disable-next-line max-len
			if (keyA === '**What would you like the message to say?** Use a ``|`` to separate the title from the description, like so\n```\nThis is a title | this is the description\n```') {
				const vContent = valueA.split('|');
				ticEmbed.setTitle(vContent.slice(0, 1).toString());
				const descp = vContent.slice(1, 2).join('');
				ticEmbed.setDescription(descp.toString());
			}
			// eslint-disable-next-line max-len
			if (keyA === '**Would you like the message to have a color?** Respond with the hex code or \'none\' to skip.\nCheck out [https://htmlcolorcodes.com/color-picker/] if you need help with hex codes.') {
				if (valueA !== 'none') {
					if (valueA.startsWith('#')) {
						ticEmbed.setColor(valueA);
					} else {
						ticEmbed.setColor(`#${valueA}`);
					}
				}
			}
			// eslint-disable-next-line max-len
			if (keyA === '**What style (color) would you like the button?** Respond with \'none\' for grey.\nOptions: `PRIMARY` = Blurple, `SECONDARY` = Grey, `SUCCESS` = Green, `DANGER` = Red') {
				if (valueA === 'none') {
					tic.set('style', 'SECONDARY');
				} else {
					const lowVal = valueA.toLowerCase();
					if (lowVal === 'primary') {
						tic.set('style', 'PRIMARY');
					} else if (lowVal === 'success') {
						tic.set('style', 'SUCCESS');
					} else if (lowVal === 'danger') {
						tic.set('style', 'DANGER');
					} else {
						tic.set('style', 'SECONDARY');
					}
				}
			}
			if (keyA === '**What would you like the button label to be?** Respond with \'none\' to use default: ️Open Ticket') {
				if (valueA === 'none') {
					tic.set('label', 'Open Ticket');
				} else {
					tic.set('label', valueA);
				}
			}
			if (keyA === '**What emoji would you like in the button?** Respond with \'none\' to use default: ️:tickets:') {
				if (valueA === 'none') {
					tic.set('emoji', '🎟️');
				} else {
					tic.set('emoji', valueA);
				}
			}
		}

		const emoji = await tic.get('emoji');
		const regex = emoji.replace(/^<a?:\w+:(\d+)>$/, '$1');
		const fEmoji = message.guild.emojis.cache.find((emj) => emj.name === emoji || emj.id === regex);
		if (fEmoji) {
			tic.set('rmoji', fEmoji);
		} else {
			tic.set('rmoji', emoji);
		}

		const label = tic.get('label');
		const style = tic.get('style');
		const rmoji = tic.get('rmoji');
		const ticketOpenButton = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('openTicket_function')
					.setLabel(label)
					.setStyle(style)
					.setEmoji(rmoji)
			);

		const ticChannel = tic.get('channel');
		let yesMSG = 'Approved.';
		const ticMSG = await ticChannel.send({ embeds: [ticEmbed], components: [ticketOpenButton] })
			.then(
				yesMSG = await message.channel.send('**Ticket Embed Complete** | Your embed has successfully been sent.')
			)
			.catch((err) => { yesMSG.delete(); message.channel.send(`**Error Occured** | Please Redo the command.\nError:\`\`\`${err}\`\`\``); });
		ticketEmbed.set(`channel_${message.guild.id}_${ticMSG.id}`, ticChannel);
	}

};
