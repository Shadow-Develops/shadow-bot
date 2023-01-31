const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');
const db = require('quick.db');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['halp'],
			description: 'Displays all the commands / command information.',
			category: 'Information',
			usage: '(command)',
			guildOnly: true
		});
	}

	async run(message, [command]) {
		message.delete();
		let prefix = db.get(`prefix_${message.guild.id}`);
		const defaultprefix = '*';
		if (prefix === null) {
			prefix = defaultprefix;
		}
		const embed = new MessageEmbed()
			.setColor('BLUE')
			.setAuthor({ name: `${message.guild.name} Help Menu`, iconURL: message.guild.iconURL({ dynamic: true }) })
			.setThumbnail(this.client.user.displayAvatarURL())
			.setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();

		if (command) {
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

			if (!cmd) return message.channel.send(`Invalid Command named. \`${command}\``);

			embed.setAuthor({ name: `${this.client.utils.capitalise(cmd.name)} Command Help`, iconURL: this.client.user.displayAvatarURL() });
			embed.setDescription(
				`**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}
				**❯ Description:** ${cmd.description}
				**❯ Category:** ${cmd.category}
				**❯ Usage:** ${prefix}${cmd.usage}`
			);

			return message.channel.send({ embeds: [embed] });
		} else {
			embed.setDescription(
				`These are the available commands for ${message.guild.name}
				The bot's prefix is: **${prefix}**
				Command Parameters: \`<>\` is strict & \`()\` is optional`
			);
			let categories;
			if (!this.client.owners.includes(message.author.id)) {
				categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));
			} else {
				categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category));
			}

			for (const category of categories) {
				embed.addField(`**${this.client.utils.capitalise(category)}**`, this.client.commands.filter(cmd =>
					cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
			}
			return message.channel.send({ embeds: [embed] });
		}
	}

};
