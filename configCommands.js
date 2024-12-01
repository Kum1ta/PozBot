const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

let config = {};
let breakTime = {hour: 15, minute: 32, second: 42};

try {
	let configFile = fs.readFileSync('config.json', 'utf8', "r");
	config = JSON.parse(configFile);
} catch (e) {}

if (config.breakTime && config.breakTime.hour && config.breakTime.minute && config.breakTime.second)
	breakTime = config.breakTime;


let	jsonCommands = {
	pause: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Get the time of the break'),
	change_time: new SlashCommandBuilder()
		.setName('change_time')
		.setDescription('Change the time of the break')
		.addIntegerOption(option => option.setName('hour').setDescription('The hour of the break').setRequired(true))
		.addIntegerOption(option => option.setName('minute').setDescription('The minute of the break').setRequired(true))
		.addIntegerOption(option => option.setName('second').setDescription('The second of the break').setRequired(true)),
	ping: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Get a pong response with the bot\'s latency'),
}

let funcCommands = {
	async pause(interaction, client)
	{
		let hour = ("0" + breakTime.hour).slice(-2)
		let minute = ("0" + breakTime.minute).slice(-2)
		let second = ("0" + breakTime.second).slice(-2)
		await interaction.reply(`The next break will be at ${hour}:${minute}:${second}`);
	},
	async change_time(interaction, client)
	{
		const hour = interaction.options.getInteger('hour');
		const minute = interaction.options.getInteger('minute');
		const second = interaction.options.getInteger('second');

		breakTime.hour = hour
		breakTime.minute = minute
		breakTime.second = second

		config.breakTime = breakTime;
		try {
			fs.writeFileSync('config.json', JSON.stringify(config), "utf8", "+w");
		} catch (e) {}

		let res_hour = ("0" + breakTime.hour).slice(-2)
		let res_minute = ("0" + breakTime.minute).slice(-2)
		let res_second = ("0" + breakTime.second).slice(-2)
		await interaction.reply(`The next break will be at ${res_hour}:${res_minute}:${res_second}`);
		client.setPauseTimeout();
	},
	async ping(interaction, client)
	{
		const time = Date.now();
		const messageTime = interaction.createdTimestamp;

		await interaction.reply('Pong ' + (time - messageTime) + 'ms');
	},
};

module.exports = { jsonCommands, funcCommands, breakTime };