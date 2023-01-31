/* eslint-disable new-cap */
const SquadBotClient = require('./Structures/SquadBotClient');
const config = require('../config.json');

const client = new SquadBotClient(config);
client.start();
