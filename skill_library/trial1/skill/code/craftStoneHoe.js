async function craftStoneHoe(bot) {
  // Check if there are enough cobblestones and sticks in the inventory
  const cobblestoneCount = bot.inventory.count(mcData.itemsByName.cobblestone.id);
  const sticksCount = bot.inventory.count(mcData.itemsByName.stick.id);

  // If not enough cobblestones, mine cobblestones
  if (cobblestoneCount < 2) {
    await mineBlock(bot, "stone", 2 - cobblestoneCount);
    bot.chat("Collected cobblestones.");
  }

  // If not enough sticks, craft sticks
  if (sticksCount < 1) {
    await craftItem(bot, "stick", 1 - sticksCount);
    bot.chat("Crafted sticks.");
  }

  // Place the crafting table near the bot
  const craftingTablePosition = bot.entity.position.offset(1, 0, 0);
  await placeItem(bot, "crafting_table", craftingTablePosition);

  // Craft a stone hoe using the crafting table
  await craftItem(bot, "stone_hoe", 1);
  bot.chat("Crafted a stone hoe.");
}