const Command = require('../../Structures/Command');

module.exports = class GnomeCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Gnome a user.',
			category: 'Fun',
			usage: '<user>',
			guildOnly: true,
			args: true
		});
	}

	async run(message) {
		message.delete();

		const user = message.mentions.users.first();

		// eslint-disable-next-line max-len
		message.channel.send(`${user} Ho ho ho ha ha, ho ho ho he ha. Hello there, old chum. I’m g'not a g'nelf. I’m g'not a g'noblin. I’m a g'nome!! And you’ve been, GNOOOMED by ${message.author.username}!!!\nhttps://media4.giphy.com/media/LrM4uJ1x8MlCYMGERJ/200w.gif`);
	}

};
