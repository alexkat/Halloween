const {
  EmbedBuilder,
} = require("discord.js");
const { DiscordAPIError } = require("discord.js");
async function executeGift(interaction) {
  try {
    const { guild, member } = interaction;
    const mentionedUser = interaction.options.get("user");
    console.log("mentionedUser", mentionedUser);

    if (!mentionedUser) {
      await interaction.editReply({
        content: "To give candy, you must mention the user.",
        ephemeral: true,
      });
      return;
    }

    if (mentionedUser.user.id === member.id) {
      await interaction.editReply({
        content: "You cannot gift candy to yourself.",
        ephemeral: true,
      });
      return;
    }

    const mentionedMember = await guild.members.fetch(mentionedUser.user.id);
    const giverRole = guild.roles.cache.find(
      (role) => role.name === "Candy Giver"
    );
    const receiverRole = guild.roles.cache.find(
      (role) => role.name === "Candy Receiver"
    );

    const bothRolesPresent =
      member.roles.cache.has(giverRole.id) &&
      member.roles.cache.has(receiverRole.id);

    if (bothRolesPresent) {
      const nextStepMessage = new EmbedBuilder().setDescription(
        "You already have the Candy Giver and Candy Receiver role, please use the /halloween command"
      );
      try {
        await interaction.editReply({
          ephemeral: true,
          embeds: [nextStepMessage],
        });
        return;
      } catch (error) {
        if (error instanceof DiscordAPIError && error.code === 50027) {
          console.error("Invalid webhook token.");
        } else {
          throw error;
        }
      }

      const filter = (i) => {
        i.customId === "next_step" && i.user.id === interaction.user.id;
      };

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 15000,
      });

      collector.on("collect", async (i) => {
        await i.update({
          content: `Proceeding to the next step of the quest...`,
          components: [],
        });
      });
    } else {
      if (
        member.roles.cache.has(giverRole.id) &&
        !member.roles.cache.has(receiverRole.id)
      ) {
        const nextStepMessage = new EmbedBuilder().setDescription(
          "You have already given candy. To continue the quest you must be given candy."
        );
        await interaction.editReply({
          embeds: [nextStepMessage],
          ephemeral: true,
        });
        return;
      }

      if (mentionedMember.roles.cache.has(receiverRole.id)) {
        await interaction.editReply({
          content: `${mentionedUser.user.username} already has candy.`,
          ephemeral: true,
        });
        return;
      }
      await mentionedMember.roles.add(receiverRole);

      if (!member.roles.cache.has(giverRole.id)) {
        await member.roles.add(giverRole);
      }

      await interaction.followUp({
        content: `User ${member.user.username} gifted candy to ${mentionedUser.user.username}.`,
      });
      await interaction.followUp({
        content: `User ${member.user.username} gifted candy to ${mentionedUser.user.username}.`,
      });
    }
  } catch (error) {
    console.error("Error executing gift command:", error);
    await interaction.editReply({
      content: "An error occurred while executing the command.",
      ephemeral: true,
    });
  }
}

module.exports = { executeGift };
