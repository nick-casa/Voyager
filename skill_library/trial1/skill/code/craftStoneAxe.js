async function craftStoneAxe(bot) {
  // Check if there are enough cobblestones in the inventory
  const cobblestoneCount = bot.inventory.count(mcData.itemsByName.cobblestone.id);
  if (cobblestoneCount < 3) {
    await mineBlock(bot, "stone", 3 - cobblestoneCount);
    bot.chat("Collected cobblestone.");
  }

  // Place the crafting table near the bot
  const craftingTablePosition = bot.entity.position.offset(1, 0, 0);
  await placeItem(bot, "crafting_table", craftingTablePosition);

  // Craft a stone axe using the crafting table
  await craftItem(bot, "stone_axe", 1);
  bot.chat("Crafted a stone axe.");

  // Equip the stone axe
  const stoneAxe = bot.inventory.items().find(item => item.name === "stone_axe");
  await bot.equip(stoneAxe, "hand");
  bot.chat("Equipped the stone axe.");
}