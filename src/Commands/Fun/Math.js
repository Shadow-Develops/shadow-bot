/* eslint-disable no-unreachable */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class MathCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Do a math proplem.',
			category: 'Fun',
			aliases: ['calculator', 'caculate'],
			usage: '<number> <operation> <second number>',
			guildOnly: true,
			args: true
		});
	}

	async run(message, args) {
		message.delete();

		const embed = new MessageEmbed()
			.setTitle('Caculator')
			.setColor('BLUE')
			.setTimestamp()
			.setFooter({ text: `Requested by: ${message.author.username}` })
			.addField(`**❯ Problem:**`, `${args[0]} ${args[1]} ${args[2]}`)
			.addField(`**❯ Answer:**`, `${calculator(args[0], args[1], args[2])}`);

		try {
			message.channel.send({ embeds: [embed] });
		} catch (err) {
			console.log(err);
		}
	}

};

function calculator(num1, operator, num2) {
	if (isNaN(num1)) return 'Number 1 is not a number';
	if (isNaN(num2)) return 'Number 2 is not a number';

	switch (operator) {
		case '+':
			return parseInt(num1) + parseInt(num2);
			break;
		case '-':
			return num1 - num2;
			break;
		case '*':
			return num1 * num2;
			break;
		case '/':
			return (num1 / num2).toFixed(2);
			break;
		default:
			return 'Enter a valid operator (+|-|*|/)';
			break;
	}
}
