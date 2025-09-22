async function smeltRemainingIronAndCraftIronPickaxe(bot) {
  // Check if there is a furnace in the inventory
  let furnaceItem = bot.inventory.findInventoryItem(mcData.itemsByName.furnace.id);

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

  // Smelt the remaining 5 iron_ore using the available coal as fuel
  await smeltItem(bot, "iron_ore", "coal", 5);
  bot.chat("Smelted 5 iron ores into 5 iron ingots.");

  // Check if there are enough iron ingots and sticks in the inventory
  const ironIngotsCount = bot.inventory.count(mcData.itemsByName.iron_ingot.id);
  const sticksCount = bot.inventory.count(mcData.itemsByName.stick.id);

  // If not enough iron ingots or sticks, collect the required items
  if (ironIngotsCount < 3) {
    await mineBlock(bot, "iron_ore", 3 - ironIngotsCount);
    bot.chat("Collected iron ores.");
    await smeltItem(bot, "iron_ore", "coal", 3 - ironIngotsCount);
    bot.chat("Smelted iron ores into iron ingots.");
  }
  if (sticksCount < 2) {
    await craftItem(bot, "stick", 1);
    bot.chat("Crafted sticks.");
  }

  // Craft an iron pickaxe using the crafting table
  await craftItem(bot, "iron_pickaxe", 1);
  bot.chat("Crafted an iron pickaxe.");
}

async function findSuitablePosition(bot) {
  const offsets = [new Vec3(1, 0, 0), new Vec3(-1, 0, 0), new Vec3(0, 0, 1), new Vec3(0, 0, -1)];
  for (const offset of offsets) {
    const position = bot.entity.position.offset(offset.x, offset.y, offset.z);
    const block = bot.blockAt(position);
    if (block.name === "air") {
      return position;
    }
  }
  return null;
}