async function craftStoneArmor(bot) {
  // Check if the bot is running on a version of Minecraft that has stone armor
  if (!mcData.itemsByName.stone_chestplate) {
    bot.chat("This version of Minecraft does not have stone armor.");
    return;
  }

  // Check if the bot has the recipe for crafting a stone chestplate, stone leggings, and stone boots
  const stoneChestplateRecipe = bot.recipesFor(mcData.itemsByName.stone_chestplate.id, null, 1, bot.inventory).pop();
  const stoneLeggingsRecipe = bot.recipesFor(mcData.itemsByName.stone_leggings.id, null, 1, bot.inventory).pop();
  const stoneBootsRecipe = bot.recipesFor(mcData.itemsByName.stone_boots.id, null, 1, bot.inventory).pop();
  if (!stoneChestplateRecipe || !stoneLeggingsRecipe || !stoneBootsRecipe) {
    bot.chat("Bot does not have the recipe for crafting stone armor.");
    return;
  }

  // Check if the bot has the required materials for crafting the items
  const cobblestoneCount = bot.inventory.count(mcData.itemsByName.cobblestone.id);
  if (cobblestoneCount < 24) {
    await mineBlock(bot, "cobblestone", 24 - cobblestoneCount);
    bot.chat(`Collected ${24 - cobblestoneCount} cobblestone.`);
  }

  // Place a crafting table near the bot
  const craftingTablePosition = bot.entity.position.offset(1, 0, 0);
  await placeItem(bot, "crafting_table", craftingTablePosition);

  // Craft a stone chestplate, stone leggings, and stone boots using the crafting table
  await craftItem(bot, "stone_chestplate", 1);
  bot.chat("Crafted a stone chestplate.");
  await craftItem(bot, "stone_leggings", 1);
  bot.chat("Crafted stone leggings.");
  await craftItem(bot, "stone_boots", 1);
  bot.chat("Crafted stone boots.");

  // Equip the stone chestplate, stone leggings, and stone boots
  const stoneChestplate = bot.inventory.items().find(item => item.name === "stone_chestplate");
  const stoneLeggings = bot.inventory.items().find(item => item.name === "stone_leggings");
  const stoneBoots = bot.inventory.items().find(item => item.name === "stone_boots");
  await bot.equip(stoneChestplate, "torso");
  await bot.equip(stoneLeggings, "legs");
  await bot.equip(stoneBoots, "feet");
  bot.chat("Equipped the stone armor.");
}