async function craftCraftingTable(bot) {
  // Check if there are enough acacia logs in the inventory
  const acaciaLogsCount = bot.inventory.count(mcData.itemsByName.acacia_log.id);

  // If not, mine more acacia logs
  if (acaciaLogsCount < 4) {
    await mineBlock(bot, "acacia_log", 4 - acaciaLogsCount);
    bot.chat("Mined acacia logs.");
  }

  // Craft 4 acacia planks from each acacia log in the inventory
  await craftItem(bot, "acacia_planks", acaciaLogsCount * 4);
  bot.chat(`Crafted ${acaciaLogsCount * 4} acacia planks.`);

  // Craft a crafting table using 4 acacia planks
  await craftItem(bot, "crafting_table", 1);
  bot.chat("Crafted a crafting table.");
}