const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Play a game of slots.',
			category: 'Fun',
			usage: '<question>',
			guildOnly: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		message.delete();
		if (!args.slice(0).join(' ')) {
			const ErrorEmbed = new MessageEmbed()
				.setTitle('Youch! I bumped into an error!')
				.setColor(0xff0000)
				.addField('Error', `\`\`Provide a question for the 8-ball.\`\``)
				.setTimestamp();

			return message.channel.send({ embeds: [ErrorEmbed] });
		}

		const RatingArray = ['🟢', '🟡', '🔴'];

		const Choices = [
			// Good Fate
			{ Rating: 0, Message: 'It is certain.' },
			{ Rating: 0, Message: 'It is decidedly so.' },
			{ Rating: 0, Message: 'Without a doubt.' },
			{ Rating: 0, Message: 'Yes - definitely.' },
			{ Rating: 0, Message: 'You may rely on it.' },
			{ Rating: 0, Message: 'As I see it, yes.' },
			{ Rating: 0, Message: 'Most likely.' },
			{ Rating: 0, Message: 'Outlook good.' },
			{ Rating: 0, Message: 'Yes.' },
			{ Rating: 0, Message: 'Signs point to: Yes.' },

			// Not so Good Fate
			{ Rating: 1, Message: 'Reply hazy, try again later.' },
			{ Rating: 1, Message: 'Ask again later.' },
			{ Rating: 1, Message: 'Better not tell you now.' },
			{ Rating: 1, Message: 'Cannot predict now.' },
			{ Rating: 1, Message: 'Concentrate and ask again.' },

			// Bad Fate
			{ Rating: 2, Message: "Don't count on it." },
			{ Rating: 2, Message: 'My sources say no.' },
			{ Rating: 2, Message: 'My reply is no.' },
			{ Rating: 2, Message: 'Outlook not so good.' },
			{ Rating: 2, Message: 'Very doubtful.' }
		];

		const Choice = Choices[Math.floor(Math.random() * Choices.length)];

		const Embed = new MessageEmbed()
			.setTitle('The 8-Ball has spoken!')
			.setColor(0xa6e1ff)
			.addField('Question', `\`\`${args.slice(0).join(' ')}\`\``)
			.addField('Answer', `\`\`${Choice.Message}\`\``)
			.addField('Rating', RatingArray[Choice.Rating])
			.setFooter({ text: `Requested by ${message.member.user.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

		return message.channel.send({ embeds: [Embed] });
	}

};
