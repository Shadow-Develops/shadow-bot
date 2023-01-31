const Command = require('../../Structures/Command');
const fetch = require('node-fetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Add an overlay to your image.',
			category: 'Fun',
			aliases: ['imageoverlay', 'overlayimage'],
			usage: '<url> <text size> <text color> <x align> <y align> <text>',
			guildOnly: true,
			args: true
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, args) {
		const url = args[0];
		if (!validURL(url)) return message.reply('Please input a valid URL.');
		const textSize = args[1];
		if (!textSize) return message.reply('You must put in a text size. Valid Options: `8, 10, 12, 14, 16, 32, 64, 128`.');
		const textColor = args[2];
		if (!textColor || textColor.startsWith('#')) return message.reply('A valid hex color must be provided, but do not put a # in front.');
		const xAlign = args[3];
		if (!xAlign) return message.reply('X alignment must be provided.. Valid Options: `left, right, center`.');
		const yAlign = args[4];
		if (!yAlign) return message.reply('Y alignment must be provided. Valid Options: `top, middle, bottom`.');
		const text = args.slice(5).join('%20');
		if (!text) return message.reply('Text must be entered.');

		const ogMsg = await message.reply('<a:loading:875974030778306610> ***Editing Image....***');

		const response = await fetch(`https://textoverimage.moesif.com/image?image_url=${url}&text=${text}&text_color=${textColor}&text_size=${textSize}&y_align=${yAlign}&x_align=${xAlign}`);
		if (response.status === 404) return message.reply(`An Error has accord. Please review your information and try again`);

		ogMsg.edit(response.url);
	}

};

function validURL(str) {
	// protocol
	// domain name
	// OR ip (v4) address
	// port and path
	// query string
	// fragment locator
	var pattern = new RegExp('^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$', 'i');
	return !!pattern.test(str);
}
