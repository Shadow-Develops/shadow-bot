const Command = require('../../Structures/Command');
const { MessageEmbed, MessageCollector } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Start a poll on something.',
			category: 'Message',
			usage: '<channel | "none" for current> | <title> | <question>',
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		let input = args.join(' ');

		const filter = (msg) => msg.author.id === message.author.id;
		// eslint-disable-next-line max-len
		const colMsg = await message.channel.send('Please enter all emojis you want to use below. | Type `done` when you are finished, and `none` for 👍, 👎, 🤷‍♂️ to be used.');
		const collector = new MessageCollector(message.channel, filter, { idle: 1500000 });

		const info = [];
		const eMsgs = [];

		collector.on('collect', async msg => {
			if (msg.content.toLowerCase() === `none`) {
				info.push('default');
				eMsgs.push(msg);
				collector.stop();
			}
			if (msg.content === 'done') {
				eMsgs.push(msg);
				collector.stop();
			}
			eMsgs.push(msg);
			info.push(msg.content);
			await msg.react('✅');
		});

		collector.on('end', async () => {
			colMsg.delete();
			for (const eMsg of eMsgs) {
				eMsg.delete();
			}

			input = input.split(' | ');
			let channel = input.slice(0, 1).pop();
			const title = input.slice(1, 2).pop();
			const question = input.slice(2, 3).pop();

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

			const Embed = new MessageEmbed()
				.setTitle(title)
				.setDescription(question)
				.setFooter({ text: `${message.author.tag} created this poll.` })
				.setTimestamp()
				.setColor(`RANDOM`);

			const msgEmbed = await channel.send({ embeds: [Embed] });


			for (const emoji of info) {
				if (emoji === 'default') {
					await msgEmbed.react('👍');
					await msgEmbed.react('👎');
					await msgEmbed.react('🤷‍♂️');
					return;
				} else {
					const regex = emoji.replace(/^<a?:\w+:(\d+)>$/, '$1');
					const fEmoji = message.guild.emojis.cache.find((emj) => emj.name === emoji || emj.id === regex);
					if (fEmoji) {
						msgEmbed.react(fEmoji);
					} else {
						msgEmbed.react(emoji);
					}
				}
			}
		});
	}

};
