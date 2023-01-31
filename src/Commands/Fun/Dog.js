const Command = require('../../Structures/Command');
const fetch = require('node-fetch');

const subreddits = [
	'dog',
	'dogs',
	'dogpics',
	'puppies'
];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Make a dog picture apear.',
			category: 'Fun',
			guildOnly: true
		});
	}

	async run(message) {
		message.delete();
		message.channel.send('Summoning Dog...').then(msg => setTimeout(() => msg.delete(), 600));
		const data = await fetch(`https://imgur.com/r/${subreddits[Math.floor(Math.random() * subreddits.length)]}/hot.json`)
			.then(response => response.json())
			.then(body => body.data);
		const selected = data[Math.floor(Math.random() * data.length)];
		return message.channel.send(`http://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`);
	}

};
