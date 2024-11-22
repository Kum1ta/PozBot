const { TwitterApi } = require('twitter-api-v2');
const credentials = require("./credentials.json");

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

export { sendTweet };
