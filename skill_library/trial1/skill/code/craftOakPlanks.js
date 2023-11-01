async function craftOakPlanks(bot) {
  // Check if there are enough oak logs in the inventory
  const oakLogsCount = bot.inventory.count(mcData.itemsByName.oak_log.id);

  // If there are enough oak logs, craft 4 oak planks from the oak logs
  if (oakLogsCount >= 1) {
    await craftItem(bot, "oak_planks", 1);
    bot.chat("Crafted 4 oak planks.");
  } else {
    bot.chat("Not enough oak logs to craft oak planks.");
  }
}