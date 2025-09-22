async function mineOneWoodLog(bot) {
  const woodLogNames = ["oak_log", "birch_log", "spruce_log", "jungle_log", "acacia_log", "dark_oak_log", "mangrove_log"];

  // Find a wood log block
  const woodLogBlock = await exploreUntil(bot, new Vec3(Math.floor(Math.random() * 3) - 1, 0, Math.floor(Math.random() * 3) - 1), 60, () => {
    return bot.findBlock({
      matching: block => woodLogNames.includes(block.name),
      maxDistance: 32
    });
  });
  if (!woodLogBlock) {
    bot.chat("Could not find a wood log.");
    return;
  }

  // Mine the wood log block
  await mineBlock(bot, woodLogBlock.name, 1);
  bot.chat("Wood log mined.");

  // Check the inventory to make sure the bot has 1 wood log in total
  const totalWoodLogs = bot.inventory.count(mcData.itemsByName.oak_log.id) + bot.inventory.count(mcData.itemsByName.birch_log.id) + bot.inventory.count(mcData.itemsByName.spruce_log.id) + bot.inventory.count(mcData.itemsByName.jungle_log.id) + bot.inventory.count(mcData.itemsByName.acacia_log.id) + bot.inventory.count(mcData.itemsByName.dark_oak_log.id) + bot.inventory.count(mcData.itemsByName.mangrove_log.id);
  if (totalWoodLogs === 1) {
    bot.chat("Successfully mined 1 wood log.");
  } else {
    bot.chat("Failed to mine 1 wood log.");
  }
}