const { MessageCollector, MessageButton, MessageActionRow } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['button'],
			description: 'Add a button to any of the bot\'s message.',
			category: 'Messages',
			usage: '<message id> <emoji> <link> <label>',
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
		let emoji = args[1];
		const link = args[2];
		const label = args.slice(3).join(' ');
		if (!msgID) return message.reply('**Invalid Inputs** | You must enter a message ID.');
		if (!emoji) return message.reply('**Invalid Inputs** | You must input an emoji.');
		if (!validURL(link) || !link) return message.reply('**Invalid Inputs** | You must input a valid link.');
		if (!label) return message.reply('**Invalid Inputs** | You must input a label.');

		const regex = emoji.replace(/^<a?:\w+:(\d+)>$/, '$1');
		const fEmoji = message.guild.emojis.cache.find((emj) => emj.name === emoji || emj.id === regex);
		if (fEmoji) emoji = fEmoji;

		let sucMs = '';

		try {
			const msg = await message.channel.messages.fetch(msgID);
			let buttons = msg.components;
			if (buttons.length) buttons = msg.components.pop().components;

			const button = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setStyle('LINK')
						.setURL(link)
						.setLabel(label)
						.setEmoji(emoji),
					buttons
				);

			if (msg.embeds.length) {
				msg.edit({
					contents: msg.content,
					embeds: msg.embeds,
					components: [button]
				})
					.then(sucMs = await message.reply('✅ Button Added.'))
					.catch(() => {
						message.reply(':x: **Error** | Command could not complete.');
						sucMs.delete();
					});
			} else {
				msg.edit({
					contents: msg.content,
					components: [button]
				})
					.then(sucMs = await message.reply('✅ Button Added.'))
					.catch(() => {
						message.reply(':x: **Error** | Command could not complete.');
						sucMs.delete();
					});
			}
		} catch (err) {
			const filter = (msg) => msg.author.id === message.author.id;
			const colMSG = await message.channel.send('**Invalid Channel** | Please state below the channel that the message is in. (You can mention the channel, state the name, or provide the ID.)');
			const collector = new MessageCollector(message.channel, filter, { idle: 1500000 });

			let channel = '';

			collector.on('collect', async cMSG => {
				const chan = cMSG.content;
				const channelName = message.guild.channels.cache.find(rl => rl.name === chan);
				if (channelName !== undefined) {
					channel = channelName;
					cMSG.delete().then(colMSG.delete());
					collector.stop();
				} else {
					const channelId = message.guild.channels.cache.find(rl => rl.id === chan);
					if (channelId !== undefined) {
						channel = channelId;
						cMSG.delete().then(colMSG.delete());
						collector.stop();
					} else {
						const vID = chan.slice(2, 20);
						const channelId2 = message.guild.channels.cache.find(rl => rl.id === vID);
						if (channelId2 !== undefined) {
							channel = channelId2;
							cMSG.delete().then(colMSG.delete());
							collector.stop();
						}
					}
				}
			});

			collector.on('end', async () => {
				const msg = await channel.messages.fetch(msgID);
				let buttons = msg.components;
				if (buttons.length) buttons = msg.components.pop().components;

				const button = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setStyle('LINK')
							.setURL(link)
							.setLabel(label)
							.setEmoji(emoji),
						buttons
					);

				if (msg.embeds.length) {
					msg.edit({
						contents: msg.content,
						embeds: msg.embeds,
						components: [button]
					})
						.then(sucMs = await message.reply('✅ Button Added.'))
						.catch(() => {
							message.reply(':x: **Error** | Command could not complete.');
							sucMs.delete();
						});
				} else {
					msg.edit({
						contents: msg.content,
						components: [button]
					})
						.then(sucMs = await message.reply('✅ Button Added.'))
						.catch(() => {
							message.reply(':x: **Error** | Command could not complete.');
							sucMs.delete();
						});
				}
			});
		}
	}

};

function validURL(str) {
	// protocol
	// domain name
	// OR ip (v4) address
	// port and path
	// query string
	// fragment locator
	var pattern = new RegExp('^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$', 'i');
	return !!pattern.test(str);
}
