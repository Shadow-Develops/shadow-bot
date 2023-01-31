const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		console.log([
			`Bot Started`,
			`Logged in as ${this.client.user.tag}`,
			`Loaded ${this.client.commands.size} commands!`,
			`Loaded ${this.client.events.size} events!`
		].join('\n'));

		let i = 0;
		setInterval(() => {
			const activities = [
				`bots.shadowdevs.com`,
				`*help | ${this.client.guilds.cache.size} servers!`,
				`*help | ${this.client.channels.cache.size} channels!`,
				`*help | ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users!`
			];

			this.client.user.setActivity(`${activities[i++ % activities.length]}`, { type: 'WATCHING' });
		}, 10000);
	}

};
