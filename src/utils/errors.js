const { MessageEmbed } = require('discord.js');

module.exports.noPerms = (message, perm) => {
	const embed = new MessageEmbed()
		.setTitle('Insufficient Permissions')
		.setColor('RED')
		.addField('You Require:',
			`${perm}
			***OR***
			ADMINISTRATOR`
		)
		.setFooter({ text: message.author.tag })
		.setTimestamp();

	message.channel.send({ embeds: [embed] });
};

module.exports.noBotPerms = (message, perm) => {
	const embedB = new MessageEmbed()
		.setTitle('Insufficient Permissions')
		.setColor('RED')
		.addField('Bot Requires:',
			`${perm}
			***OR***
			ADMINISTRATOR`
		)
		.setFooter({ text: message.author.tag })
		.setTimestamp();

	message.channel.send({ embeds: [embedB] });
};
