const { executeQuest } = require("../commands/questExecution");
const { executeGift } = require("../commands/giftExecution");

const cooldownDuration = 30000; // 30 seconds cooldown

async function handleInteractionCreate(interaction) {
  try {
    if (!interaction.isCommand()) return;

    const commandName = interaction.commandName;

    // Check if the user is on cooldown
    const cooldownKey = `${commandName}-${interaction.user.id}`;
    if (global.cooldowns.has(cooldownKey)) {
      const cooldownEnd = global.cooldowns.get(cooldownKey) + cooldownDuration;
      const timeLeft = (cooldownEnd - Date.now()) / 1000;

      if (timeLeft > 0) {
        return await interaction.deferReply({
          content: `You're using this command too quickly! Please wait ${timeLeft.toFixed(
            1
          )} more seconds before trying again.`,
          ephemeral: true,
        });
      }
    }

    // Set the cooldown for the user
    global.cooldowns.set(cooldownKey, Date.now());

    // Automatically remove the user from the cooldown map after the duration has passed
    setTimeout(() => {
      global.cooldowns.delete(cooldownKey);
    }, cooldownDuration);
    // Execute the corresponding command based on the command name
    switch (commandName) {
      case "give-candy":
        await executeGift(interaction);
        break;
      case "halloween":
        await executeQuest(interaction);
        break;
      default:
        console.warn(`Unhandled command: ${commandName}`);
        break;
    }
  } catch (error) {
    console.error("Error handling interaction create:", error);
  }
}

async function addCommandToGuild(client, campaign) {
  const { commandName, description, serverId, options } = campaign;

  if (!commandName || !description || !serverId) {
    console.error("Invalid campaign data:", campaign);
    return;
  }

  const guild = client.guilds.cache.get(serverId);
  if (!guild) {
    console.error(`Guild not found for ID: ${serverId}`);
    return;
  }

  const existingCommand = guild.commands.cache.find(
    (cmd) => cmd.name === commandName
  );
  if (existingCommand) {
    console.log(
      `Command '${commandName}' already exists in guild '${guild.name}' (ID: ${serverId})`
    );
    return;
  }

  try {
    await guild.commands.create({
      name: commandName,
      description,
      options: options,
    });
    console.log(
      `Added command '${commandName}' to guild '${guild.name}' (ID: ${serverId})`
    );
  } catch (error) {
    console.error(
      `Error adding command '${commandName}' to guild '${guild.name}' (ID: ${serverId}):`,
      error
    );
  }
}

module.exports = { handleInteractionCreate, addCommandToGuild };
