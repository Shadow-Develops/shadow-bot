const { MessageCollector, MessageActionRow } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['rbutton'],
			description: 'Remove a button from a message.',
			category: 'Messages',
			usage: '<message id> <label>',
			userPerms: ['MANAGE_MESSAGES'],
			botPerms: ['MANAGE_MESSAGES'],
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		if (message.partial) await message.fetch();
		const msgID = args[0];
		const theLabel = args.slice(1).join(' ');
		if (!msgID) return message.reply('**Invalid Inputs** | You must enter a message ID.');
		if (!theLabel) return message.reply('**Invalid Inputs** | You must input a valid label.');

		let sucMs = '';
		const goodButtons = [];

		try {
			const msg = await message.channel.messages.fetch(msgID);
			const buttons = msg.components.pop().components;

			for (const button of buttons) {
				const { label } = button;
				if (label !== theLabel) goodButtons.push(button);
			}

			const button = new MessageActionRow()
				.addComponents(
					goodButtons
				);

			if (msg.embeds.length) {
				msg.edit({
					contents: msg.content,
					embeds: msg.embeds,
					components: [button]
				})
					.then(sucMs = await message.reply('✅ Button Removed.'))
					.catch(() => {
						message.reply(':x: **Error** | Command could not complete.');
						sucMs.delete();
					});
			} else {
				msg.edit({
					contents: msg.content,
					components: [button]
				})
					.then(sucMs = await message.reply('✅ Button Removed.'))
					.catch(() => {
						message.reply(':x: **Error** | Command could not complete.');
						sucMs.delete();
					});
			}
		} catch (err) {
			const filter = (msgF) => msgF.author.id === message.author.id;
			const colMSG = await message.channel.send('**Invalid Channel** | Please state below the channel that the message is in. (You can mention the channel, state the name, or provide the ID.)');
			const collector = new MessageCollector(message.channel, filter, { idle: 1500000 });

			const channels = [];

			collector.on('collect', async cMSG => {
				const chan = cMSG.content;
				const channelName = message.guild.channels.cache.find(rl => rl.name === chan);
				if (channelName !== undefined) {
					channels.push(channelName);
					cMSG.delete().then(colMSG.delete());
					collector.stop();
				} else {
					const channelId = message.guild.channels.cache.find(rl => rl.id === chan);
					if (channelId !== undefined) {
						channels.push(channelId);
						cMSG.delete().then(colMSG.delete());
						collector.stop();
					} else {
						const vID = chan.slice(2, 20);
						const channelId2 = message.guild.channels.cache.find(rl => rl.id === vID);
						if (channelId2 !== undefined) {
							channels.push(channelId2);
							cMSG.delete().then(colMSG.delete());
							collector.stop();
						}
					}
				}
			});

			collector.on('end', async () => {
				for (const channel of channels) {
					const msg = await channel.messages.fetch(msgID);
					const buttons = msg.components.pop().components;

					for (const button of buttons) {
						const { label } = button;
						if (label !== theLabel) goodButtons.push(button);
					}

					const button = new MessageActionRow()
						.addComponents(
							goodButtons
						);

					if (msg.embeds.length) {
						msg.edit({
							contents: msg.content,
							embeds: msg.embeds,
							components: [button]
						})
							.then(sucMs = await message.reply('✅ Button Removed.'))
							.catch(() => {
								message.reply(':x: **Error** | Command could not complete.');
								sucMs.delete();
							});
					} else {
						msg.edit({
							contents: msg.content,
							components: [button]
						})
							.then(sucMs = await message.reply('✅ Button Removed.'))
							.catch(() => {
								message.reply(':x: **Error** | Command could not complete.');
								sucMs.delete();
							});
					}
				}
			});
		}
	}

};
