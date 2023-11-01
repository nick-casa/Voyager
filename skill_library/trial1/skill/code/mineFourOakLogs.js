async function mineFourOakLogs(bot) {
  // Find 4 oak_log blocks
  const oakLogs = await exploreUntil(bot, new Vec3(1, 0, 1), 60, () => {
    const oakLogs = bot.findBlocks({
      matching: block => block.name === "oak_log",
      maxDistance: 32,
      count: 4
    });
    return oakLogs.length >= 4 ? oakLogs : null;
  });
  if (!oakLogs) {
    bot.chat("Could not find enough oak logs.");
    return;
  }

  // Mine the 4 oak_log blocks
  await mineBlock(bot, "oak_log", 4);
  bot.chat("4 oak logs mined.");

  // Check the inventory to make sure the bot has 5 oak logs in total
  const totalOakLogs = bot.inventory.count(mcData.itemsByName.oak_log.id);
  if (totalOakLogs === 5) {
    bot.chat("Successfully mined 4 oak logs.");
  } else {
    bot.chat("Failed to mine 4 oak logs.");
  }
}