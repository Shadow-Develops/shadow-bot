/* eslint-disable new-cap */
const Event = require('../../Structures/Event');
const db = require('quick.db');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

	async run(member) {
		const logs = new db.table('logstable');
		const jlogs = logs.get(`joinlogs_${member.guild.id}`);
		if (jlogs) {
			const channel = member.guild.channels.cache.find(ch => ch.id === `${jlogs.id}`);
			channel.send(`${member} (${member.user.tag} - ${member.user.id}) **Joined**`);

			const roles = new db.table('rolestable');
			const atrolest = roles.get(`autorolestatus_${member.guild.id}`);
			const atrole = roles.get(`autorole_${member.guild.id}`);
			if (atrolest === 'true') {
				member.roles.add(atrole.id).catch(console.error);
			}
		}
		const ages = new db.table('agetable');
		const agen = ages.get(`accountage_${member.guild.id}`);
		const agest = ages.get(`accountagelimit_${member.guild.id}`);
		if (agest === 'true') {
			if (moment(member.user.createdTimestamp).fromNow() < agen) {
				// eslint-disable-next-line max-len
				await this.client.users.cache.get(`${member.user.id}`).send(`Your account does not meet the acount age requirement in **${member.guild.name}**. \nYour Account was created \`${moment(member.user.createdTimestamp).fromNow()}\`.\n**❯ Required Age:** **\`${agen}\`**`)
					.then(member.guild.members.kick(member, { reason: 'Underage Account.' }));
			}
		}

		const welcomemessage = new db.table('welcomemessagetable');
		const wmst = welcomemessage.get(`welcomemessagest_${member.guild.id}`);
		const wmsg = welcomemessage.get(`welcomemessage_${member.guild.id}`);
		const wEmbed = new MessageEmbed()
			.setFooter({ text: `You joined ${member.guild.name}!` })
			.setColor('BLURPLE')
			.setTimestamp()
			.setDescription(wmsg ? wmsg.toString() : 'Welcome to the server! Please read the rules and enjoy everything we offer.');
		if (wmst === 'true') {
			this.client.users.cache.get(`${member.user.id}`).send({ embeds: [wEmbed] });
		}
	}

};
