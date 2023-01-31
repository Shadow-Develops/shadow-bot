/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['settingsclear'],
			description: 'Clear all the settings for your server.',
			category: 'Settings',
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message) {
		const owner = message.guild.members.cache.find((member) => member.id === message.guild.ownerId);
		if (message.author.id === owner.id) return message.reply('**Invalid Permissions.** | You must be the server owner to do this command.');
		message.delete();
		const logs = new db.table('logstable');
		const roles = new db.table('rolestable');
		const ages = new db.table('agetable');
		const ticketset = new db.table('ticketsettings');
		const welcomemessage = new db.table('welcomemessagetable');

		logs.get(`messagelogs_${message.guild.id}`);
		logs.get(`joinlogs_${message.guild.id}`);
		logs.get(`channellogs_${message.guild.id}`);
		logs.get(`banlogs_${message.guild.id}`);
		logs.get(`kicklogs_${message.guild.id}`);
		logs.get(`rolelogs_${message.guild.id}`);
		logs.get(`warnlogs_${message.guild.id}`);
		logs.get(`mutelogs_${message.guild.id}`);
		roles.get(`autorolestatus_${message.guild.id}`);
		roles.get(`autorole_${message.guild.id}`);
		roles.get(`muterole_${message.guild.id}`);
		ages.get(`accountage_${message.guild.id}`);
		ages.get(`accountagelimit_${message.guild.id}`);
		ticketset.get(`ticketsupportrole_${message.guild.id}`);
		ticketset.get(`ticketcategory_${message.guild.id}`);
		ticketset.get(`ticketdescription_${message.guild.id}`);
		welcomemessage.get(`welcomemessage_${message.guild.id}`);
		welcomemessage.get(`welcomemessagest_${message.guild.id}`);

		await message.channel.send(`Are you sure you want to delete **all** your settings?\nType **\`yes\`** if you do. \nType **\`no\`** to cancel.`);
		await message.channel.awaitMessages(msg => msg.author.id === message.author.id, {
			max: 1,
			time: 10000,
			errors: ['time']
		})
			// eslint-disable-next-line consistent-return
			.then(async collected => {
				if (collected.first().content === 'yes') {
					await message.channel.send(`Finial Confirmation! You can not go back after this!\nType **\`yes\`** to delete all your settings. \nType **\`no\`** to cancel.`);
					await message.channel.awaitMessages(msg => msg.author.id === message.author.id, {
						max: 1,
						time: 10000,
						errors: ['time']
					})
						// eslint-disable-next-line consistent-return
						.then(collected2 => {
							if (collected2.first().content === 'yes') {
								logs.delete(`messagelogs_${message.guild.id}`);
								logs.delete(`joinlogs_${message.guild.id}`);
								logs.delete(`channellogs_${message.guild.id}`);
								logs.delete(`banlogs_${message.guild.id}`);
								logs.delete(`kicklogs_${message.guild.id}`);
								logs.delete(`rolelogs_${message.guild.id}`);
								logs.delete(`warnlogs_${message.guild.id}`);
								logs.delete(`mutelogs_${message.guild.id}`);
								roles.delete(`autorolestatus_${message.guild.id}`);
								roles.delete(`autorole_${message.guild.id}`);
								roles.delete(`muterole_${message.guild.id}`);
								ages.delete(`accountage_${message.guild.id}`);
								ages.delete(`accountagelimit_${message.guild.id}`);
								ticketset.delete(`ticketsupportrole_${message.guild.id}`);
								ticketset.delete(`ticketcategory_${message.guild.id}`);
								ticketset.delete(`ticketdescription_${message.guild.id}`);
								welcomemessage.delete(`welcomemessage_${message.guild.id}`);
								welcomemessage.delete(`welcomemessagest_${message.guild.id}`);

								message.channel.send('**Confirmed.** | All your server settings are deleted.');
							} else if (collected2.first().content === 'no') {
								message.channel.send('**Canceled.** | Settings will not be deleted.');
							}
						}).catch(() => {
							message.channel.send('**Timed Out.** | Settings will not be deleted.');
						});
				} else if (collected.first().content === 'no') {
					message.channel.send('**Canceled.** | Settings will not be deleted.');
				}
			}).catch(() => {
				message.channel.send('**Timed Out.** | Settings will not be deleted.');
			});
	}

};
