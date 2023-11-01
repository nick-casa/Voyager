async function craftCraftingTable(bot) {
  // Check if there are enough oak planks in the inventory
  const oakPlanksCount = bot.inventory.count(mcData.itemsByName.oak_planks.id);

  // If there are enough oak planks, craft a crafting table
  if (oakPlanksCount >= 4) {
    await craftItem(bot, "crafting_table", 1);
    bot.chat("Crafted a crafting table.");
  } else {
    bot.chat("Not enough oak planks to craft a crafting table.");
  }
}