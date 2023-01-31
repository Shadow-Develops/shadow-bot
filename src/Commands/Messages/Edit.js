const { MessageCollector } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Edit a message the bot has sent.',
			category: 'Messages',
			usage: '<message id> <new message>',
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
		const text = args.slice(1).join(' ');
		if (!msgID) return message.reply('**Invalid Inputs** | You must enter a message ID.').then(msgg => setTimeout(() => msgg.delete(), 1000));
		if (!text) return message.reply('**Invalid Inputs** | You must input a new message.').then(msgg => setTimeout(() => msgg.delete(), 1000));

		try {
			const msg = await message.channel.messages.fetch(msgID);

			msg.edit(text)
				.then(message.reply('***Message Successfully Edited.***')
					.then(msgg => setTimeout(() => {
						msgg.delete();
						message.delete();
					}, 1000))
				);
		} catch (err) {
			const filter = (msg) => msg.author.id === message.author.id;
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

					msg.edit(text)
						.then(message.reply('***Message Successfully Edited.***')
							.then(msgg => setTimeout(() => {
								msgg.delete();
								message.delete();
							}, 1000))
						);
				}
			});
		}
	}

};
