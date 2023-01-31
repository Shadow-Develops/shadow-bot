/* eslint-disable max-len */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['settingslist'],
			description: 'Get a list of all of the settings in the format for changing them.',
			category: 'Settings',
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
		const embed = new MessageEmbed()
			.setColor('ORANGE')
			.setTitle(`${message.guild.name} Settings Format List`)
			.setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();
		if (args[0] === 'example' || args[0] === 'examples') {
			embed.setDescription(`This shows examples of all of the settings in proper format.\nThe channel name, mute role name, and autorole number can be anything, does not have to be what is show here. You can set it to anything that you want and fits within the format.`);
			embed.addField('Proper Formats',
				`**•** messagelogs #message-logs
				**•** joinlogs join-leave-logs
				**•** channellogs #channel-logs
				**•** banlogs ban-logs
				**•** kicklogs 123456789123456789
				**•** rolelogs #rolelogs
				**•** warnlogs 123456789123456789
				**•** mutelogs mutelogs
				**•** autorole 123456789123456789
				**•** muterole Muted
				**•** ticketsupportrole 123456789123456789
				**•** autotrole-on
				**•** autorole-off
				**•** requiredage 15
				**•** accountagelimit-on
				**•** accountagelimit-off
				**•** ticketcategory 123456789123456789
				**•** ticketdescription This is my super epic description!
				**•** welcomemessage This is my super epic welcome message!
				**•** welcomemessage-on
				**•** welcomemessage-off`
			);
		} else {
			embed.setDescription(`This shows the list of all the settings in the format for changing them.\nDo \`${prefix}settingsformat examples\` for a list of examples in the proper format.\n**If you do not use them in the proper format then they will not work!**`);
			embed.addField('Proper Formats',
				`**•** messagelogs <channel name/id or mention channel>
				**•** joinlogs <channel name/id or mention channel>
				**•** channellogs <channel name/id or mention channel>
				**•** banlogs <channel name/id or mention channel>
				**•** kicklogs <channel name/id or mention channel>
				**•** rolelogs <channel name/id or mention channel>
				**•** warnlogs <channel name/id or mention channel>
				**•** mutelogs <channel name/id or mention channel>
				**•** autorole <role name/id>
				**•** muterole <role name/id>
				**•** ticketsupportrole <role name/id>
				**•** autotrole-on
				**•** autorole-off
				**•** requiredage <number>
				**•** accountagelimit-on
				**•** accountagelimit-off
				**•** ticketcategory <category id>
				**•** ticketdescription <description>
				**•** welcomemessage <message>
				**•** welcomemessage-on
				**•** welcomemessage-off`
			);
		}

		message.channel.send({ embeds: [embed] });
	}

};
