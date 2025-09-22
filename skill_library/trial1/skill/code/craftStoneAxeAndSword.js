async function craftStoneAxeAndSword(bot) {
  // Check if there are enough cobblestone and sticks in the inventory
  const cobblestoneCount = bot.inventory.count(mcData.itemsByName.cobblestone.id);
  const sticksCount = bot.inventory.count(mcData.itemsByName.stick.id);

  // If not enough cobblestone or sticks, collect the required items
  if (cobblestoneCount < 3) {
    await mineBlock(bot, "stone", 3 - cobblestoneCount);
    bot.chat("Collected cobblestone.");
  }
  if (sticksCount < 2) {
    await craftItem(bot, "stick", 2 - sticksCount);
    bot.chat("Crafted sticks.");
  }

  // Find a valid position to place the crafting table
  const validBlocks = ["stone", "cobblestone", "andesite", "diorite", "granite"];
  const craftingTablePosition = await exploreUntil(bot, new Vec3(1, 0, 1), 60, () => {
    const block = bot.blockAt(bot.entity.position.offset(1, 0, 1));
    if (validBlocks.includes(block.name)) {
      return block.position;
    }
    return null;
  });

  // If no valid position found, return
  if (!craftingTablePosition) {
    bot.chat("Could not find a valid position to place the crafting table.");
    return;
  }

  // Place the crafting table
  await placeItem(bot, "crafting_table", craftingTablePosition);

  // Craft a stone axe and a stone sword using the crafting table
  await craftItem(bot, "stone_axe", 1);
  bot.chat("Crafted a stone axe.");
  await craftItem(bot, "stone_sword", 1);
  bot.chat("Crafted a stone sword.");

  // Equip the stone axe and the stone sword
  const stoneAxe = bot.inventory.items().find(item => item.name === "stone_axe");
  const stoneSword = bot.inventory.items().find(item => item.name === "stone_sword");
  await bot.equip(stoneAxe, "hand");
  await bot.equip(stoneSword, "off-hand");
  bot.chat("Equipped the stone axe and the stone sword.");
}