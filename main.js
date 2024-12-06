const { jsonCommands, funcCommands, breakTime } = require('./configCommands.js');
const { Client, GatewayIntentBits } = require("discord.js");
const { Routes } = require('discord-api-types/v9');
const credentials = require("./credentials.json");
// const { sendTweet } = require("./sendTweet.js");
const { REST } = require('@discordjs/rest');
const {isthanks} = require('./goodwords.js');

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
]});


function sleep(ms)
{
	return new Promise((res) => {
		setTimeout(() => {
			res();
		}, ms);
	});
}

client.commandRegistry = Object.values(jsonCommands);
client.commands = client.commandRegistry.map((command) => command.toJSON());
const rest = new REST({ version: '9' }).setToken(credentials.token);
(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(credentials.clientId, credentials.guildId),
			{ body: client.commands },
		);
	} catch (error) {
		console.error(error);
	}
})();

client.pauseTimeout = null;
client.pauseMsgGuild = null;
client.pauseMsgChannel = null;
client.setPauseTimeout = function() {
	// clear last timeout
	if (this.pauseTimeout)
		clearTimeout(this.pauseTimeout)
	this.pauseTimeout = null;

	// set next break date
	let currentDate = new Date();
	let nextBreakDate = new Date();
	nextBreakDate.setHours(breakTime.hour);
	nextBreakDate.setMinutes(breakTime.minute);
	nextBreakDate.setSeconds(breakTime.second);
	if (nextBreakDate <= currentDate)
		nextBreakDate.setDate(currentDate.getDate() + 1);

	// timeout until break
	console.log((nextBreakDate - currentDate) + "ms until next break")
	this.pauseTimeout = setTimeout(() => {
		client.pauseMsgChannel.send("It's time to take a break ||@everyone||!")
		// await sendTweet("It's Time to take a Break!");
		this.pauseTimeout = null;
		this.setPauseTimeout();
	}, nextBreakDate - currentDate + 1)
}

client.on("ready", async () => {

	client.pauseMsgGuild = await client.guilds.fetch(credentials.guildId);
	client.pauseMsgChannel = await client.pauseMsgGuild.channels.fetch(credentials.channelId);
	client.setPauseTimeout();
	client.pauseMsgChannel.send("I'm ready!");
});

client.on("messageCreate", async (message) => {
	if (message.author.bot)
		return ;
	if (message.content.includes("<@1309512222694838312>") && isthanks(message))
		{
		message.reply("You're welcome " + message.author.displayName + " !  :grinning:");
	}
});

client.on("interactionCreate", (interaction) => {
	if (interaction.isCommand())
	{
		if (funcCommands[interaction.commandName])
			funcCommands[interaction.commandName](interaction, client);
	}
})

client.login(credentials.token);
