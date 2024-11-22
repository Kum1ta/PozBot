const { Client, GatewayIntentBits } = require("discord.js");
const { TwitterApi } = require('twitter-api-v2');
const credentials = require("./credentials.json");

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
]});

const twitterClient = new TwitterApi({
  appKey: credentials.twitterApiKey,
  appSecret: credentials.twitterApiSecretKey,
  accessToken: credentials.twitterAccessToken,
  accessSecret: credentials.twitterAccessSecret
});

async function sendTweet(message) {
  try {
    await twitterClient.v2.tweet(message);
    console.log("Tweet envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi du tweet :", error);
  }
}

client.on("ready", () => {
  console.log(`${client.user.tag} est prêt à envoyer des tweets !`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.includes("It's time to take a break")) {
    sendTweet("It's Time to take a Break!");
  }
});

client.login(credentials.token);
