async function smeltIronOre(bot) {
  // Check if there is a furnace in the inventory
  const furnaceItem = bot.inventory.findInventoryItem(mcData.itemsByName.furnace.id);

  // If not, craft a furnace using the available cobblestone
  if (!furnaceItem) {
    await craftItem(bot, "furnace", 1);
    bot.chat("Crafted a furnace.");

    // Update the furnace item
    furnaceItem = bot.inventory.findInventoryItem(mcData.itemsByName.furnace.id);
  }

  // Find a suitable position to place the furnace
  const furnacePosition = await findSuitablePosition(bot);
  if (!furnacePosition) {
    bot.chat("Could not find a suitable position to place the furnace.");
    return;
  }

  // Place the furnace at the suitable position
  await placeItem(bot, "furnace", furnacePosition);
  bot.chat("Placed a furnace.");

  // Check if there is enough coal in the inventory
  const coalCount = bot.inventory.count(mcData.itemsByName.coal.id);

  // If not enough coal, mine coal_ore to obtain coal
  if (coalCount < 5) {
    await mineBlock(bot, "coal_ore", 5 - coalCount);
    bot.chat("Collected coal.");
  }

  // Smelt 5 iron_ore using the available coal as fuel
  await smeltItem(bot, "iron_ore", "coal", 5);
  bot.chat("Smelted 5 iron ores into 5 iron ingots.");
}