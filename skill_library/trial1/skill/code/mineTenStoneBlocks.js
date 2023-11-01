async function mineTenStoneBlocks(bot) {
  // Equip the wooden pickaxe
  const woodenPickaxe = bot.inventory.findInventoryItem(mcData.itemsByName.wooden_pickaxe.id);
  await bot.equip(woodenPickaxe, "hand");

  // Use the exploreUntil function to find stone blocks
  const stoneBlocks = await exploreUntil(bot, new Vec3(1, -1, 1), 60, () => {
    const stoneBlocks = bot.findBlocks({
      matching: block => block.name === "stone",
      maxDistance: 32,
      count: 10
    });
    return stoneBlocks.length >= 10 ? stoneBlocks : null;
  });
  if (!stoneBlocks) {
    bot.chat("Could not find enough stone blocks.");
    return;
  }

  // Mine 10 stone blocks using the mineBlock function
  await mineBlock(bot, "stone", 10);
  bot.chat("10 stone blocks mined.");
}