async function mineTenLapisOre(bot) {
  // Check if the bot has a stone pickaxe or better
  let pickaxe = bot.inventory.items().find(item => item.name.endsWith("_pickaxe"));
  if (!pickaxe || pickaxe.name === "wooden_pickaxe") {
    // If not, craft a stone pickaxe using the available resources in the inventory
    const cobblestoneCount = bot.inventory.count(mcData.itemsByName.cobblestone.id);
    const stickCount = bot.inventory.count(mcData.itemsByName.stick.id);
    if (cobblestoneCount < 3) {
      await mineBlock(bot, "cobblestone", 3 - cobblestoneCount);
      bot.chat("Collected cobblestones.");
    }
    if (stickCount < 2) {
      await craftItem(bot, "stick", 1);
      bot.chat("Crafted sticks.");
    }
    await craftItem(bot, "stone_pickaxe", 1);
    bot.chat("Crafted a stone pickaxe.");
    // Update the pickaxe item
    pickaxe = bot.inventory.findInventoryItem(mcData.itemsByName.stone_pickaxe.id);
  }
  // Equip the pickaxe
  await bot.equip(pickaxe, "hand");

  // Use the exploreUntil function to find lapis ore blocks
  const lapisOres = await exploreUntil(bot, new Vec3(Math.floor(Math.random() * 3) - 1, -1, Math.floor(Math.random() * 3) - 1), 60, () => {
    const lapisOres = bot.findBlocks({
      matching: block => block.name === "lapis_ore",
      maxDistance: 32,
      count: 10
    });
    return lapisOres.length >= 10 ? lapisOres : null;
  });
  if (!lapisOres) {
    bot.chat("Could not find enough lapis ore.");
    return;
  }

  // Mine the lapis ore blocks using the mineBlock function
  await mineBlock(bot, "lapis_ore", 10);
  bot.chat("Mined 10 lapis ore.");

  // Check the inventory to ensure that we have at least 10 lapis lazuli
  const lapisLazuliCount = bot.inventory.count(mcData.itemsByName.lapis_lazuli.id);
  if (lapisLazuliCount < 10) {
    bot.chat("Could not collect enough lapis lazuli.");
    return;
  }
}