const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const {
  fetchStory,
  finalStep,
} = require("../utils/questManager");

async function sendQuestion(collected, firstQuestion, interaction) {
  const user = interaction.user;
  const guild = interaction.guild;
  const member = interaction.member;
  const roles = interaction.member.roles.cache;
  const giverRole = roles.find((role) => role.name === "Candy Giver");
  const helloweenRole = guild.roles.cache.find(
    (role) => role.name === "Haunted Story Hero"
  );
  const receiverRole = roles.find((role) => role.name === "Candy Receiver");
  try {
    let answerSymbols = ["\u{1F1E6}", "\u{1F1E7}", "\u{1F1E8}", "\u{1F1E9}"];
    let answerDescription = "";
    for (let i = 0; i < firstQuestion.story.answers.length; i++) {
      answerDescription += `${answerSymbols[i]} - ${firstQuestion.story.answers[i].answer} \n\n`;
    }
    const questionEmbed = new EmbedBuilder()
      .setTitle(`Helloween Story`)
      .setDescription(
        `${firstQuestion.story.question}\n\n ${answerDescription}`
      );

    let answersButton = new ActionRowBuilder();
    for (let i = 0; i < firstQuestion.story.answers.length; i++) {
      answersButton.addComponents(
        new ButtonBuilder()
          .setCustomId(`${i}answer${user.id}`)
          .setLabel(`${String.fromCharCode(65 + i)}`)
          .setStyle(ButtonStyle.Success)
      );
    }

    try {
      await collected.editReply({
        ephemeral: true,
        embeds: [questionEmbed],
        components: [answersButton],
      });
    } catch (error) {
      console.log(error);
    }
    const filter = (collected) =>
      collected.customId.endsWith(`answer${user.id}`) && collected.isButton();
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
    });
    collector.once("collect", async (collected) => {
      const buttonAnswer = collected.customId.charAt(0);
      const selectedAnswer = firstQuestion.story.answers[buttonAnswer];
      await collected.deferUpdate();
      if (selectedAnswer.hasOwnProperty("isCorrect")) {
        if (selectedAnswer.isCorrect) {
          const finalStepResult = await finalStep(selectedAnswer.nextStep);
          sendFinalmessage(collected, finalStepResult, true);
          await member.roles.add(helloweenRole);
        } else {
          const finalStepResult = await finalStep(selectedAnswer.nextStep);
          sendFinalmessage(collected, finalStepResult, false);

          await member.roles.remove(giverRole);
          await member.roles.remove(receiverRole);
        }
      } else {
        const nextStepMessage = await fetchStory(selectedAnswer.nextStep);
        sendNextMessage(collected, nextStepMessage, interaction);
      }
    });
  } catch (error) {
    console.error("Error in sendQuestion function:", error);
  }
}

async function sendFinalmessage(collected, finalStep, bool) {
  const buttonStyle = bool ? ButtonStyle.Success : ButtonStyle.Danger;

  const buttonLabel = bool
    ? "You successfully helped Mr. Harrison"
    : "Failed, Mr. Harrison was left in the lurch. Try again.";

  const passed = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
      .setCustomId("passed")
      .setLabel(buttonLabel)
      .setStyle(buttonStyle)
      .setDisabled(true),
  ]);

  const questEmbed = new EmbedBuilder()
    .setTitle("Helloween story")
    .setDescription(finalStep.story.message);

  try {
    await collected.editReply({
      ephemeral: true,
      embeds: [questEmbed],
      components: [passed],
    });
  } catch (error) {
    console.log(error);
  }
}

async function sendNextMessage(collected, nextMessage, interaction) {
  const user = interaction.user;
  const guild = interaction.guild;
  const member = interaction.member;
  const roles = interaction.member.roles.cache;
  const giverRole = roles.find((role) => role.name === "Candy Giver");
  const receiverRole = roles.find((role) => role.name === "Candy Receiver");
  const helloweenRole = guild.roles.cache.find(
    (role) => role.name === "Haunted Story Hero"
  );
  try {
    let answerSymbols = ["\u{1F1E6}", "\u{1F1E7}", "\u{1F1E8}", "\u{1F1E9}"];
    let answerDescription = "";
    for (let i = 0; i < nextMessage.story.answers.length; i++) {
      answerDescription += `${answerSymbols[i]} - ${nextMessage.story.answers[i].answer} \n\n`;
    }
    const questionEmbed = new EmbedBuilder()
      .setTitle(`Helloween Story`)
      .setDescription(`${nextMessage.story.question}\n\n ${answerDescription}`);

    let answersButton = new ActionRowBuilder();
    for (let i = 0; i < nextMessage.story.answers.length; i++) {
      answersButton.addComponents(
        new ButtonBuilder()
          .setCustomId(`${i}answer${user.id}`)
          .setLabel(`${String.fromCharCode(65 + i)}`)
          .setStyle(ButtonStyle.Success)
      );
    }

    try {
      await collected.editReply({
        ephemeral: true,
        embeds: [questionEmbed],
        components: [answersButton],
      });

      const filter = (collected) =>
        collected.customId.endsWith(`answer${user.id}`) && collected.isButton();
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
      });
      collector.once("collect", async (collected) => {
        const buttonAnswer = collected.customId.charAt(0);
        const selectedAnswer = nextMessage.story.answers[buttonAnswer];
        await collected.deferUpdate();
        if (selectedAnswer.hasOwnProperty("isCorrect")) {
          if (selectedAnswer.isCorrect) {
            const finalStepResult = await finalStep(selectedAnswer.nextStep);
            sendFinalmessage(collected, finalStepResult, true);
            await member.roles.add(helloweenRole);
          } else {
            const finalStepResult = await finalStep(selectedAnswer.nextStep);
            sendFinalmessage(collected, finalStepResult, false);
            await member.roles.remove(giverRole);
            await member.roles.remove(receiverRole);
          }
        } else {
          const nextStepMessage = await fetchStory(selectedAnswer.nextStep);
          sendNextMessage(collected, nextStepMessage, interaction);
        }
      });
    } catch (error) {
      console.error("Error in sendQuestion function:", error);
    }
  } catch (error) {
    console.error("Error in sendQuestion function:", error);
  }
}
module.exports = { sendQuestion };
