const { SlashCommandBuilder } = require('discord.js');
let breakTime = {hour: 15, minute: 32, second: 42};


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
	async pause(interaction)
	{
		await interaction.reply(`The next break will be at ${breakTime.hour}:${breakTime.minute}:${breakTime.second}`);
	},
	async change_time(interaction)
	{
		const hour = interaction.options.getInteger('hour');
		const minute = interaction.options.getInteger('minute');
		const second = interaction.options.getInteger('second');

		breakTime.hour = hour
		breakTime.minute = minute
		breakTime.second = second		
		await interaction.reply(`The next break will be at ${breakTime.hour}:${breakTime.minute}:${breakTime.second}`);
	},
	async ping(interaction)
	{
		const time = Date.now();
		const messageTime = interaction.createdTimestamp;

		await interaction.reply('Pong ' + (time - messageTime) + 'ms');
	},
};

module.exports = { jsonCommands, funcCommands, breakTime };