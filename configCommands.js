const { SlashCommandBuilder } = require('discord.js');

let	jsonCommands = {
	ping: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Get a pong response with the bot\'s latency'),
}

let funcCommands = {
	async ping(interaction)
	{
		const time = Date.now();
		const messageTime = interaction.createdTimestamp;

		await interaction.reply('Pong ' + (time - messageTime) + 'ms');
	},
};

module.exports = { jsonCommands, funcCommands };