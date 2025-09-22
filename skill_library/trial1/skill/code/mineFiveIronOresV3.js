async function mineFiveIronOres(bot) {
  // Check if the bot has a stone pickaxe
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
    let craftingTablePosition = await exploreUntil(bot, new Vec3(1, 0, 1), 60, () => {
      const position = findSuitablePosition(bot);
      if (position) {
        return position;
      }
      return null;
    });
    if (!craftingTablePosition) {
      bot.chat("Could not find a suitable position to place the crafting table.");
      return;
    }

    // Place the crafting table at the suitable position
    try {
      await placeItem(bot, "crafting_table", craftingTablePosition);
      bot.chat("Placed a crafting table.");
    } catch (error) {
      bot.chat(`Error placing crafting_table: ${error.message}`);
      return;
    }

    // Craft a stone pickaxe using the crafting table
    await craftItem(bot, "stone_pickaxe", 1);
    bot.chat("Crafted a stone pickaxe.");

    // Update the stone pickaxe item
    stonePickaxe = bot.inventory.findInventoryItem(mcData.itemsByName.stone_pickaxe.id);
  }

  // Equip the stone pickaxe
  await bot.equip(stonePickaxe, "hand");

  // Find 5 iron_ore blocks
  let ironOres = bot.findBlocks({
    matching: block => block.name === "iron_ore",
    maxDistance: 32,
    count: 5
  });
  if (ironOres.length < 5) {
    bot.chat("Could not find enough iron ores.");
    ironOres = await exploreUntil(bot, new Vec3(1, 0, 1), 60, () => {
      const ironOres = bot.findBlocks({
        matching: block => block.name === "iron_ore",
        maxDistance: 32,
        count: 5
      });
      return ironOres.length >= 5 ? ironOres : null;
    });
    if (!ironOres) {
      bot.chat("Could not find enough iron ores.");
      return;
    }
  }

  // Mine the 5 iron_ore blocks
  await mineBlock(bot, "iron_ore", 5);
  bot.chat("5 iron ores mined.");
}

function findSuitablePosition(bot) {
  const offsets = [new Vec3(1, 0, 0), new Vec3(-1, 0, 0), new Vec3(0, 0, 1), new Vec3(0, 0, -1)];
  for (const offset of offsets) {
    const position = bot.entity.position.offset(offset.x, offset.y, offset.z);
    const block = bot.blockAt(position);
    if (block.name === "air") {
      return position;
    }
  }
  return null;
}