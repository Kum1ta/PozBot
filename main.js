const { jsonCommands, funcCommands } = require('./configCommands.js');
const { Client, GatewayIntentBits } = require("discord.js");
const { Routes } = require('discord-api-types/v9');
const credentials = require("./credentials.json");
const { sendTweet } = require("./sendTweet.js");
const { REST } = require('@discordjs/rest');

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
]});

const breakTime = {hour: 15, minute: 32, second: 42};

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

client.on("ready", async () => {
	const guild = await client.guilds.fetch(credentials.guildId);
	const channel = await guild.channels.fetch(credentials.channelId);

	channel.send("I'm ready!");
	while (true)
	{
		let currentDate		= new Date();
		let nextBreakDate	= new Date();
		nextBreakDate.setHours(breakTime.hour);
		nextBreakDate.setMinutes(breakTime.minute);
		nextBreakDate.setSeconds(breakTime.second);
		if (nextBreakDate < currentDate)
			nextBreakDate.setDate(nextBreakDate.getDate() + 1);
		console.log(`Sleeping ${nextBreakDate - currentDate}ms for next break`);

		await sleep(nextBreakDate - currentDate);
		await sleep(1000);

		channel.send("It's time to take a break ||@everyone||!");
		await sendTweet("It's Time to take a Break!");
	}
});

client.on("messageCreate", async (message) => {
	if (message.author.bot)
		return ;
});

client.on("interactionCreate", (interaction) => {
	if (interaction.isCommand())
	{
		if (funcCommands[interaction.commandName])
			funcCommands[interaction.commandName](interaction);
	}
})

client.login(credentials.token)
