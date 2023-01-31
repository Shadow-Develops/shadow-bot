/* eslint-disable eqeqeq */
/* eslint-disable no-redeclare */
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Play a game of rock, paper, scissors, shoot with the bot.',
			category: 'Fun',
			usage: '<rock | paper | scissors>',
			guildOnly: true
		});
	}

	async run(message, args) {
		var choice = args[0];
		if (choice == 'paper' || choice == 'p') {
			var numb = Math.floor(Math.random() * 100);
			if (numb <= 50) {
				var choice2 = 'paper';
			} else if (numb > 50) {
				var choice2 = 'rock';
			} else {
				var choice2 = 'scissors';
			}
			if (choice2 == 'scissors') {
				var response = "I'm choosing **Scissors**! :v: I win!";
			} else if (choice2 == 'paper') {
				var response = "I'm choosing **Paper**! :hand_splayed: It's a tie!";
			} else {
				var response = "I'm choosing **Rock**! :punch: You win!";
			}
			message.reply(response);
		} else if (choice == 'rock' || choice == 'r') {
			var numb = Math.floor(Math.random() * 100);
			if (numb <= 50) {
				var choice2 = 'paper';
			} else if (numb > 50) {
				var choice2 = 'rock';
			} else {
				var choice2 = 'scissors';
			}
			if (choice2 == 'paper') {
				var response = "I'm choosing **Paper**! :hand_splayed: I win!";
			} else if (choice2 == 'rock') {
				var response = "I'm choosing **Rock**! :punch: It's a tie!";
			} else {
				var response = "I'm choosing **Scissors**! :v: You win!";
			}
			message.reply(response);
		} else if (choice == 'scissors' || choice == 's') {
			var numb = Math.floor(Math.random() * 100);
			if (numb <= 50) {
				var choice2 = 'paper';
			} else if (numb > 50) {
				var choice2 = 'rock';
			} else {
				var choice2 = 'scissors';
			}
			if (choice2 == 'rock') {
				var response = "I'm choosing **Paper**! :hand_splayed: You win!";
			} else if (choice2 == 'scissors') {
				var response = "I'm choosing **Scissors**! :v: It's a tie!";
			} else {
				var response = "I'm choosing **Rock**! :punch: I win!";
			}
			message.reply(response);
		} else {
			message.reply(`You need to pick rock, paper, or scissors.`).then(msg => setTimeout(() => msg.delete(), 10000));
		}
	}

};
