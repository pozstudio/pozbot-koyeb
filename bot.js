const mineflayer = require('mineflayer');

let bot = null;
let afkInterval = null;

function spawnBot(ip, port, version) {
  if (bot) return;

  bot = mineflayer.createBot({
    host: ip,
    port: parseInt(port),
    username: 'PozBot',
    version: version
  });

  bot.once('spawn', () => {
    bot.chat('Bot Sunucuya Bağlandı');
    bot.chat('/effect give @s invisibility 99999 1 true');

    // AFK hareketleri
    let rotate = 0;
    afkInterval = setInterval(() => {
      if (!bot || !bot.entity) return;

      rotate += Math.PI / 6;
      bot.look(rotate, 0, true);
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);
      bot.setControlState('sneak', true);
    }, 4000);
  });

  // Otomatik yeniden doğma
  bot.on('death', () => {
    console.log("Bot öldü, yeniden doğuyor...");
    setTimeout(() => {
      if (bot && bot.isDead) {
        bot.emit("respawn");
      }
    }, 3000); // 3 saniye sonra doğsun
  });

  bot.on('end', () => {
    clearInterval(afkInterval);
    bot = null;
  });

  bot.on('error', (err) => {
    console.log("Bot hatası:", err.message);
    clearInterval(afkInterval);
    bot = null;
  });
}

function stopBot() {
  if (bot) {
    bot.chat('Botun Bağlantısı Kesildi');
    setTimeout(() => bot.quit(), 1000);
  }
}

function isBotRunning() {
  return bot !== null;
}

module.exports = { spawnBot, stopBot, isBotRunning };
