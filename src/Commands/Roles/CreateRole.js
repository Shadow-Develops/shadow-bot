/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Create a role.',
			category: 'Roles',
			usage: '<name> <#hex code> \n**Note:** The # is required in the hex code.',
			userPerms: ['MANAGE_ROLES'],
			botPerms: ['MANAGE_ROLES'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		let prefix = db.get(`prefix_${message.guild.id}`);
		const defaultprefix = '*';

		if (prefix === null) {
			prefix = defaultprefix;
		}

		let rName = message.content.split(`${prefix}createrole`).join('');
		let rColor;
		args.forEach(arg => {
			if (arg.startsWith('#')) {
				rColor = arg;
			}
		});
		if (!rName) {
			return message.channel.send(`You did not specify a **Name** for a role!`);
		}
		if (!rColor) {
			return message.channel.send(`You did not specify a **Color** for a role!`);
		}
		if (rColor >= 16777215) return message.channel.send(`That is not a valid hex color range!`);
		if (rColor >= 0) return message.channel.send(`That is not a valid hex color range!`);
		rName = rName.replace(`${rColor}`, ``);
		const rNew = await message.guild.roles.create({
			name: rName,
			color: rColor,
			reason: `Role Creation Command Run By: ${message.author.username}#${message.author.discriminator}`
		});
		const Embed = new MessageEmbed()
			.setTitle(`New Role!`)
			.setDescription(`${message.author.username} has created the role "${rName}"\nIts hex color code ${rColor}\nIts ID: ${rNew.id}`)
			.setColor(rColor);
		message.channel.send({ embeds: [Embed] });

		const embed = new MessageEmbed()
			.setTitle('~Role Created~')
			.setColor('GREEN')
			.addField('Created Role',
				`**❯ Name:** ${rName}
				**❯ Color:** ${rColor}
				**❯ ID:** ${rNew.id}
				\u200b`
			)
			.addField('Created By',
				`**❯ Mention:** ${message.author}
				**❯ Hash:** ${message.author.tag}
				**❯ ID:** ${message.author.id}`
			)
			.setFooter({ text: 'Squad Bot Logging System' })
			.setTimestamp();

		const logs = new db.table('logstable');
		const rlogs = logs.get(`rolelogs_${message.guild.id}`);
		const roleChannel = message.guild.channels.cache.find(ch => ch.id === `${rlogs.id}`);
		if (roleChannel) roleChannel.send({ embeds: [embed] });
	}

};
