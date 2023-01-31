const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pong'],
			description: 'Check the ping of the bot.',
			category: 'Utility',
			guildOnly: true
		});
	}

	async run(message) {
		message.delete();
		const msg = await message.channel.send('Pinging...');

		const latency = msg.createdTimestamp - message.createdTimestamp;
		const choices = ['Is this really my ping?', 'Is this ok? I can\'t bare to look!', 'I hope I score well!'];
		const response = choices[Math.floor(Math.random() * choices.length)];

		msg.edit(`${response} \nBot Latency: \`${latency}ms\`\nAPI Latency: \`${Math.round(this.client.ws.ping)}ms\``);
	}

};
