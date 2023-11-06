const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const {
  fetchFirstQuestion,
} = require("../utils/questManager");

const { sendQuestion } = require("./quest");

async function executeQuest(interaction) {
  const user = interaction.user;
  const username = interaction.member.user.username;
  const roles = interaction.member.roles.cache;
  const giverRole = roles.find((role) => role.name === "Candy Giver");
  const receiverRole = roles.find((role) => role.name === "Candy Receiver");
  
  const welcomeEmbed = new EmbedBuilder()
    .setTitle(`Hello, ${username}!\n\nWelcome to the Helloween Quest!\n\n`)
    .setDescription(
      `Mr. Harrison, feeling fear and excitement, decides to plunge headfirst into the world of cryptocurrencies. He believes that with the right strategy, he can multiply his daughter's education funds. However, the cryptocurrency nature of this digital realm is nothing short of a roller coaster ride. Will Mr. Harrison be able to thrive in the volatile cryptocurrency markets, or will the digital specter of bankruptcy haunt his family forever? Help Mr. Harrison make a decision.`
    );

  if (!giverRole || !receiverRole) {
    await interaction.editReply({
      ephemeral: true,
      embeds: [
        welcomeEmbed.setDescription(
          "You need to obtain the 'Candy Giver' and 'Candy Receiver' roles before starting the Halloween quest."
        ),
      ],
    });
    return;
  }

  const firstQuestion = await fetchFirstQuestion();

  const startButton = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
      .setCustomId(`startQuest${user.id}`)
      .setLabel("Start Quest")
      .setStyle(ButtonStyle.Success),
  ]);

  await interaction.editReply({
    ephemeral: true,
    embeds: [welcomeEmbed],
    components: [startButton],
  });

  const filter = (collected) =>
    collected.customId.endsWith(`startQuest${user.id}`) && collected.isButton();
  const collector = interaction.channel.createMessageComponentCollector({
    filter,
  });

  collector.once("collect", async (collected) => {
    if (collected.customId.startsWith("startQuest")) {
      await collected.deferUpdate();
      await sendQuestion(collected, firstQuestion, interaction);
    }
  });
}

module.exports = { executeQuest };
