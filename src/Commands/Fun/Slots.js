const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Play a game of slots.',
			category: 'Fun',
			guildOnly: true
		});
	}

	async run(message) {
		const slots = ['🍎', '🍌', '🍒', '🍓', '🍈'];
		const result1 = Math.floor(Math.random() * slots.length);
		const result2 = Math.floor(Math.random() * slots.length);
		const result3 = Math.floor(Math.random() * slots.length);

		if (slots[result1] === slots[result2] && slots[result3]) {
			const wEmbed = new MessageEmbed()
				.setAuthor({ name: 'You Won!' })
				.setTitle(':slot_machine:Slots:slot_machine:')
				.addField('Result:', slots[result1] + slots[result2] + slots[result3], true)
				.setTimestamp()
				.setColor('GREEN');
			message.reply({ embeds: [wEmbed] });
		} else {
			const embed = new MessageEmbed()
				.setAuthor({ name: 'You Lost!' })
				.setTitle(':slot_machine:Slots:slot_machine:')
				.addField('Result', slots[result1] + slots[result2] + slots[result3], true)
				.setTimestamp()
				.setColor('GREEN');
			message.reply({ embeds: [embed] });
		}
	}

};
