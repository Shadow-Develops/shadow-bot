/* eslint-disable new-cap */
/* eslint-disable complexity */
const Command = require('../../Structures/Command');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Change the bot\'s settings.',
			category: 'Settings',
			usage: '(setting) \n **❯ Note:** When setting up commands lowercase / remove spaces. It is recommended to run the settingsformat command first.',
			userPerms: ['MANAGE_GUILD'],
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		const settings = args[0];
		const channel = message.guild.channels.cache.find(rl => rl.name === args[1]) || message.guild.channels.cache.find(rl => rl.id === args[1]) || message.mentions.channels.last();
		const category = args[1];
		const role = message.guild.roles.cache.find(rl => rl.name === args[1]) || message.guild.roles.cache.find(rl => rl.id === args[1]);
		const age = args[1];
		const descrip = args.slice(1).join(' ');
		const logs = new db.table('logstable');
		const roles = new db.table('rolestable');
		const ages = new db.table('agetable');
		const ticketset = new db.table('ticketsettings');
		const welcomemessage = new db.table('welcomemessagetable');
		const embed = new MessageEmbed()
			.setColor('ORANGE')
			.setTitle(`${message.guild.name} Settings Menu`)
			.setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();

		if (settings) {
			if (settings === 'messagelogs') {
				if (!channel) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** messagelogs <channel name/id or mention channel>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** <#${channel.id}>`
					);
					logs.set(`messagelogs_${message.guild.id}`, channel);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'joinlogs') {
				if (!channel) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** joinlogs <channel name/id or mention channel>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** <#${channel.id}>`
					);
					logs.set(`joinlogs_${message.guild.id}`, channel);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'channellogs') {
				if (!channel) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** channellogs <channel name/id or mention channel>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** <#${channel.id}>`
					);
					logs.set(`channellogs_${message.guild.id}`, channel);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'banlogs') {
				if (!channel) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** banlogs <channel name/id or mention channel>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** <#${channel.id}>`
					);
					logs.set(`banlogs_${message.guild.id}`, channel);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'kicklogs') {
				if (!channel) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** kicklogs <channel name/id or mention channel>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** <#${channel.id}>`
					);
					logs.set(`kicklogs_${message.guild.id}`, channel);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'rolelogs') {
				if (!channel) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** rolelogs <channel name/id or mention channel>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** <#${channel.id}>`
					);
					logs.set(`rolelogs_${message.guild.id}`, channel);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'warnlogs') {
				if (!channel) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** warnlogs <channel name/id or mention channel>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** <#${channel.id}>`
					);
					logs.set(`warnlogs_${message.guild.id}`, channel);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'mutelogs') {
				if (!channel) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** mutelogs <channel name/id or mention channel>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** <#${channel.id}>`
					);
					logs.set(`mutelogs_${message.guild.id}`, channel);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'autorole') {
				if (!role) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** role <role name/id>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** <@&${role.id}>`
					);
					roles.set(`autorole_${message.guild.id}`, role);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'muterole') {
				if (!role) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** muterole <role name/id>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** <@&${role.id}>`
					);
					roles.set(`muterole_${message.guild.id}`, role);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'ticketsupportrole') {
				if (!role) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** ticketsupportrole <role name/id>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** <@&${role.id}>`
					);
					ticketset.set(`ticketsupportrole_${message.guild.id}`, role);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'autorole-on') {
				embed.addField('Setting Updated',
					`**❯ Set to:** On`
				);
				roles.set(`autorolestatus_${message.guild.id}`, 'true');
				return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
			} else if (settings === 'autorole-off') {
				embed.addField('Setting Updated',
					`**❯ Set to:** off`
				);
				roles.set(`autorolestatus_${message.guild.id}`, 'false');
				return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
			} else if (settings === 'requiredage') {
				if (!age) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** accountage <number of days>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** ${age}`
					);
					ages.set(`accountage_${message.guild.id}`, age);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'accountagelimit-on') {
				embed.addField('Setting Updated',
					`**❯ Set to:** On`
				);
				ages.set(`accountagelimit_${message.guild.id}`, 'true');
				return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
			} else if (settings === 'accountagelimit-off') {
				embed.addField('Setting Updated',
					`**❯ Set to:** off`
				);
				ages.set(`accountagelimit_${message.guild.id}`, 'false');
				return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
			} else if (settings === 'welcomemessage-on') {
				embed.addField('Setting Updated',
					`**❯ Set to:** On`
				);
				welcomemessage.set(`welcomemessagest_${message.guild.id}`, 'true');
				return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
			} else if (settings === 'welcomemessage-off') {
				embed.addField('Setting Updated',
					`**❯ Set to:** off`
				);
				welcomemessage.set(`welcomemessagest_${message.guild.id}`, 'false');
				return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
			} else if (settings === 'welcomemessage') {
				if (!category) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** welcomemessage <message>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** ${descrip}`
					);
					welcomemessage.set(`welcomemessage_${message.guild.id}`, descrip);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'ticketcategory') {
				if (!category) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** ticketcategory <category id>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					const categoryID = message.guild.channels.cache.find(cat => cat.id === category);
					embed.addField('Setting Updated',
						`**❯ Set to:** ${categoryID}`
					);
					ticketset.set(`ticketcategory_${message.guild.id}`, category);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'ticketdescription') {
				if (!category) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** ticketdescription <description>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** ${descrip}`
					);
					ticketset.set(`ticketdescription_${message.guild.id}`, descrip);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'ticketlogs') {
				if (!channel) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** ticketlogs <channel name/id or mention channel>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** ${channel}`
					);
					logs.set(`ticketlogs_${message.guild.id}`, channel);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'tickettranscriptlogs') {
				if (!channel) {
					embed.addField('Invalid Usage',
						`**❯ Usage:** tickettranscriptlogs <channel name/id or mention channel>`
					);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				} else {
					embed.addField('Setting Updated',
						`**❯ Set to:** ${channel}`
					);
					logs.set(`tickettranscriptlogs_${message.guild.id}`, channel);
					return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
				}
			} else if (settings === 'ticketlimit-off') {
				embed.addField('Setting Updated',
					`**❯ Set to:** off`
				);
				ticketset.set(`ticketlimit_${message.guild.id}`, 'false');
				return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
			} else if (settings === 'ticketlimit-on') {
				embed.addField('Setting Updated',
					`**❯ Set to:** On`
				);
				ticketset.set(`ticketlimit_${message.guild.id}`, 'true');
				return message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 10000));
			}
		} else {
			let prefix = db.get(`prefix_${message.guild.id}`);
			const defaultprefix = '*';
			if (prefix === null) {
				prefix = defaultprefix;
			}
			const defaultlog = 'No Channel Set';
			const msglogs = logs.get(`messagelogs_${message.guild.id}`);
			const jlogs = logs.get(`joinlogs_${message.guild.id}`);
			const clogs = logs.get(`channellogs_${message.guild.id}`);
			const blogs = logs.get(`banlogs_${message.guild.id}`);
			const klogs = logs.get(`kicklogs_${message.guild.id}`);
			const rlogs = logs.get(`rolelogs_${message.guild.id}`);
			const wlogs = logs.get(`warnlogs_${message.guild.id}`);
			const mlogs = logs.get(`mutelogs_${message.guild.id}`);
			const ticlogs = logs.get(`ticketlogs_${message.guild.id}`);
			const tictranslogs = logs.get(`tickettranscriptlogs_${message.guild.id}`);
			const defaultrole = 'No Role Set';
			const atrolest = roles.get(`autorolestatus_${message.guild.id}`);
			const atrole = roles.get(`autorole_${message.guild.id}`);
			const mrole = roles.get(`muterole_${message.guild.id}`);
			const tsrole = ticketset.get(`ticketsupportrole_${message.guild.id}`);
			const agen = ages.get(`accountage_${message.guild.id}`);
			const agest = ages.get(`accountagelimit_${message.guild.id}`);
			const cat = ticketset.get(`ticketcategory_${message.guild.id}`);
			const desc = ticketset.get(`ticketdescription_${message.guild.id}`);
			const ticlimit = ticketset.get(`ticketlimit_${message.guild.id}`);
			const wmst = welcomemessage.get(`welcomemessagest_${message.guild.id}`);
			const wmsg = welcomemessage.get(`welcomemessage_${message.guild.id}`);
			embed.setDescription(
				`**Do \`${prefix}settingslist\` to get a list of the settings in the format for changing them.**
				These are the available settings for ${message.guild.name}
				The bot's prefix is: **${prefix}**`
			);
			embed.addField('Log Channels',
				`**❯ Message Logs:** ${msglogs === null ? defaultlog : `<#${msglogs.id}>`}
				**❯ Join Logs:** ${jlogs === null ? defaultlog : `<#${jlogs.id}>`}
				**❯ Channel Logs:** ${clogs === null ? defaultlog : `<#${clogs.id}>`}
				**❯ Ban Logs:** ${blogs === null ? defaultlog : `<#${blogs.id}>`}
				**❯ Kick Logs:** ${klogs === null ? defaultlog : `<#${klogs.id}>`}
				**❯ Role Logs:** ${rlogs === null ? defaultlog : `<#${rlogs.id}>`}
				**❯ Warn Logs:** ${wlogs === null ? defaultlog : `<#${wlogs.id}>`}
				**❯ Mute Logs:** ${mlogs === null ? defaultlog : `<#${mlogs.id}>`}
				**❯ Ticket Logs:** ${ticlogs === null ? defaultlog : `<#${ticlogs.id}>`}
				**❯ Ticket Transcript Logs:** ${tictranslogs === null ? defaultlog : `<#${tictranslogs.id}>`}
				\u200b`
			)
				.addField('Roles',
					`**❯ Auto Role:** ${atrole === null ? defaultrole : `<@&${atrole.id}>`}
					**❯ Mute Role:** ${mrole === null ? defaultrole : `<@&${mrole.id}>`}
					**❯ Ticket Support Role:** ${tsrole === null ? defaultrole : `<@&${tsrole.id}>`}
					\u200b`
					, true)
				.addField('Activity',
					`**❯ Auto Role:** ${atrolest === null ? 'Off' : atrolest === 'false' ? 'Off' : atrolest === 'true' ? 'On' : atrolest}
					**❯ Account Age Limit:** ${agest === null ? 'Off' : agest === 'false' ? 'Off' : agest === 'true' ? 'On' : agest}
					**❯ Welcome Message:** ${wmst === null ? 'Off' : wmst === 'false' ? 'Off' : wmst === 'true' ? 'On' : wmst}
					\u200b`
					, true)
				.addField('Tickets',
					`**❯ Ticket Category:** ${cat === null ? 'No Category Set' : `<#${cat}>`}
					**❯ Ticket Description:** ${desc === null ? 'No Description Set' : desc}
					**❯ Ticket Limit:** ${ticlimit === null ? 'Off' : ticlimit === 'false' ? 'Off' : ticlimit === 'true' ? 'On' : ticlimit}
					\u200b`
				)
				.addField('Welcome Message',
					`**❯** ${wmsg === null ? 'No Description Set' : wmsg}
					\u200b`
					, true)
				.addField('Rquired Age:', `**❯** ${agen === null ? 'None' : `${agen} Days`}`, true);
			return message.channel.send({ embeds: [embed] });
		}
	}

};

