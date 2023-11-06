const {
  Client,
  GatewayIntentBits,
  ApplicationCommandOptionType,
} = require("discord.js");
const {
  handleInteractionCreate,
  addCommandToGuild,
} = require("./utils/interactionCreate");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
global.cooldowns = new Map();

module.exports = client;

client.once("ready", async () => {
  try {
    console.log(`Logged in as ${client.user.tag}!`);
    addCommandToGuild(client, {
      commandName: "give-candy",
      description: "Gift a candy to a user",
      serverId: process.env.GUILD_ID,
      options: [
        // Adding options as per the advanced creation method
        {
          name: "user",
          description: "The target user",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    });
    addCommandToGuild(client, {
      commandName: "halloween",
      description: "Start the Halloween quest",
      serverId: process.env.GUILD_ID,
    });
  } catch (error) {
    console.error("Error on ready event:", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isCommand()) {
      await interaction.deferReply({
        ephemeral: true,
      });
      await handleInteractionCreate(interaction);
    }
  } catch (error) {
    console.error("Error handling interaction:", error);
  }
});

try {
  client.login(process.env.TOKEN);
} catch (error) {
  console.error("Error during client login:", error);
}
