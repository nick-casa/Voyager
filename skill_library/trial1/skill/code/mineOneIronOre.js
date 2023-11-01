async function mineOneIronOre(bot) {
  // Check if there is a stone pickaxe in the inventory
  let stonePickaxe = bot.inventory.findInventoryItem(mcData.itemsByName.stone_pickaxe.id);

  // If not, check if there are enough cobblestones and sticks to craft a stone pickaxe
  if (!stonePickaxe) {
    const cobblestoneCount = bot.inventory.count(mcData.itemsByName.cobblestone.id);
    const stickCount = bot.inventory.count(mcData.itemsByName.stick.id);

    // If not, mine cobblestones and craft sticks
    if (cobblestoneCount < 3) {
      await mineBlock(bot, "cobblestone", 3 - cobblestoneCount);
      bot.chat("Collected cobblestones.");
    }
    if (stickCount < 2) {
      await craftItem(bot, "stick", 1);
      bot.chat("Crafted sticks.");
    }

    // Check if there is a crafting table in the inventory
    let craftingTable = bot.inventory.findInventoryItem(mcData.itemsByName.crafting_table.id);

    // If not, craft a crafting table
    if (!craftingTable) {
      await craftItem(bot, "crafting_table", 1);
      bot.chat("Crafted a crafting table.");

      // Update the crafting table item
      craftingTable = bot.inventory.findInventoryItem(mcData.itemsByName.crafting_table.id);
    }

    // Find a suitable position to place the crafting table
    const craftingTablePosition = bot.entity.position.offset(1, 0, 0);

    // Place the crafting table at the suitable position
    await placeItem(bot, "crafting_table", craftingTablePosition);
    bot.chat("Placed a crafting table.");

    // Craft a stone pickaxe using the crafting table
    await craftItem(bot, "stone_pickaxe", 1);
    bot.chat("Crafted a stone pickaxe.");

    // Update the stone pickaxe item
    stonePickaxe = bot.inventory.findInventoryItem(mcData.itemsByName.stone_pickaxe.id);
  }

  // Equip the stone pickaxe
  await bot.equip(stonePickaxe, "hand");

  // Find an iron_ore block
  const ironOre = await exploreUntil(bot, new Vec3(1, -1, 1), 60, () => {
    const ironOre = bot.findBlock({
      matching: mcData.blocksByName.iron_ore.id,
      maxDistance: 32
    });
    return ironOre;
  });
  if (!ironOre) {
    bot.chat("Could not find an iron ore.");
    return;
  }

  // Mine the iron_ore block
  await mineBlock(bot, "iron_ore", 1);
  bot.chat("1 iron ore mined.");
}