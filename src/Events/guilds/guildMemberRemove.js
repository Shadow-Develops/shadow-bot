const Event = require('../../Structures/Event');
const db = require('quick.db');

module.exports = class extends Event {

	async run(member) {
		// eslint-disable-next-line new-cap
		const logs = new db.table('logstable');
		const jlogs = logs.get(`joinlogs_${member.guild.id}`);
		if (jlogs) {
			const channel = member.guild.channels.cache.find(ch => ch.id === `${jlogs.id}`);
			channel.send(`${member} (${member.user.tag} - ${member.user.id}) **Left**`);
		}
	}

};
