const { MessageAttachment } = require('discord.js');
const Command = require('../../Structures/Command');
const { Type } = require('@anishshobith/deeptype');
const { inspect } = require('util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Displays information about the bot.',
			category: 'Owner',
			guildOnly: true,
			ownerOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		const msg = message;
		if (!args.length) return msg.reply('I need code to evaluate.');
		let code = args.join(' ');
		code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
		let evaled;
		try {
			const start = process.hrtime();
			evaled = eval(code);
			if (evaled instanceof Promise) {
				evaled = await evaled;
			}
			const stop = process.hrtime(start);
			const response = [
				`**Output:** \`\`\`js\n${this.clean(inspect(evaled, { depth: 0 }))}\n\`\`\``,
				`**Type:** \`\`\`ts\n${new Type(evaled).is}\n\`\`\``,
				`**Time Taken:** \`\`\`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms \`\`\``
			];
			const res = response.join('\n');
			if (response.length < 2000) {
				await msg.reply(res);
			} else {
				const output = new MessageAttachment(Buffer.from(res), 'output.text');
				await msg.reply(output);
			}
		} catch (err) {
			return message.reply(`Error: \`\`\`xl\n${this.clean(err)}\n\`\`\``);
		}
	}

	clean(text) {
		if (typeof text === 'string') {
			text = text
				.replace(/`/g, `\`${String.fromCharCode(8203)}`)
				.replace(/@/g, `@${String.fromCharCode(8203)}`)
				.replace(new RegExp(this.client.token, 'gi'), '****');
		}
		return text;
	}

};
