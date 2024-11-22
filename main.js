const { Client, GatewayIntentBits } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { jsonCommands, funcCommands } = require('./configCommands.js');
const { Routes } = require('discord-api-types/v9');
const credentials = require("./credentials.json");

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
		let currentDate = new Date();
		let nextBreakDate = new Date();
		nextBreakDate.setHours(breakTime.hour);
		nextBreakDate.setMinutes(breakTime.minute);
		nextBreakDate.setSeconds(breakTime.second);
		if (nextBreakDate < currentDate) {
			nextBreakDate.setDate(nextBreakDate.getDate() + 1);
		}
		console.log(`Sleeping ${nextBreakDate - currentDate}ms for next break`);

		await sleep(nextBreakDate - currentDate);
		channel.send("It's time to take a break ||@everyone||!");
		await sleep(10000);
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

