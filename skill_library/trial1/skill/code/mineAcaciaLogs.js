async function mineAcaciaLogs(bot) {
  const acaciaLogsCount = bot.inventory.count(mcData.itemsByName.acacia_log.id);
  if (acaciaLogsCount >= 5) {
    bot.chat("Already have 5 acacia logs.");
    return;
  }
  bot.chat("Looking for an acacia tree...");
  const acaciaTree = await exploreUntil(bot, new Vec3(Math.floor(Math.random() * 3) - 1, 0, Math.floor(Math.random() * 3) - 1), 60, () => {
    const acaciaLogs = bot.findBlocks({
      matching: block => block.name === "acacia_log",
      maxDistance: 32,
      count: 5 - acaciaLogsCount
    });
    if (acaciaLogs.length >= 5 - acaciaLogsCount) {
      return bot.blockAt(acaciaLogs[0]);
    }
    return null;
  });
  if (!acaciaTree) {
    bot.chat("Could not find an acacia tree.");
    return;
  }
  bot.chat("Found an acacia tree. Moving to the tree...");
  await bot.pathfinder.goto(new GoalNear(acaciaTree.position.x, acaciaTree.position.y, acaciaTree.position.z, 1));
  bot.chat("Mining acacia logs...");
  await mineBlock(bot, "acacia_log", 5 - acaciaLogsCount);
  bot.chat("Acacia logs mined.");
}