const { MessageEmbed, version: djsversion } = require('discord.js');
const { version } = require('../../../package.json');
const Command = require('../../Structures/Command');
const { utc } = require('moment');
const os = require('os');
const ms = require('ms');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['credit', 'credits', 'bothelp'],
			description: 'Get all the information on the bot.',
			category: 'Information'
		});
	}

	run(message) {
		message.delete();
		const core = os.cpus()[0];
		const embed = new MessageEmbed()
			.setTitle(`Squad Bot Information`)
			.setThumbnail(this.client.user.displayAvatarURL())
			.setColor(message.guild.me.displayHexColor || 'RED')
			.addField('General',
				`**❯ Client:** ${this.client.user.tag} (${this.client.user.id})
				**❯ Commands:** ${this.client.commands.size}
				**❯ Servers:** ${this.client.guilds.cache.size.toLocaleString()}
				**❯ Users:** ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}
				**❯ Channels:** ${this.client.channels.cache.size.toLocaleString()}
				**❯ Creation Date:** ${utc(this.client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}
				**❯ Node.js Verion:** ${process.version}
				**❯ Bot Verion:** v${version}
				**❯ Discord.js Verion:** v${djsversion}
				\u200b`
			)
			.addField('System',
				`**❯ Platform:** ${process.platform}
				**❯ Uptime:** ${ms(os.uptime() * 1000, { long: true })}
				**❯ CPU:**
				\u3000 Cores: ${os.cpus().length}
				\u3000 Model: ${core.model}
				\u3000 Speed: ${core.speed}MHz
				**❯ Memory:**
				\u3000 Total: ${this.client.utils.formatBytes(process.memoryUsage().heapTotal)}
				\u3000 Used: ${this.client.utils.formatBytes(process.memoryUsage().heapUsed)}
				\u200b`
			)
			.addField('Support',
				`**❯** [Discord Server](https://discord.gg/fVrRa8z)
				**❯** [Main Website](https://www.shadowdevs.com/)
				**❯** [Bot Website](https://bots.shadowdevs.com/)
				\u200b`
			)
			.addField('Note from the Devs',
				`The bot will be updated and more features will be added in the furture.`
			)
			.setFooter({ text: '© 2020 - 2022 Shadow Development' })
			.setTimestamp();

		message.channel.send({ embeds: [embed] });
	}

};
