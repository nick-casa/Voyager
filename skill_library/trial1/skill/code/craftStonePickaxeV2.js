async function craftStonePickaxe(bot) {
  // Check if there is a stone pickaxe in the inventory
  const stonePickaxe = bot.inventory.items().find(item => item.name === "stone_pickaxe");

  // If not, craft a stone pickaxe using the available resources in the inventory
  if (!stonePickaxe) {
    await craftItem(bot, "stone_pickaxe", 1);
    bot.chat("Crafted a stone pickaxe.");
  } else {
    bot.chat("Already have a stone pickaxe.");
  }
}