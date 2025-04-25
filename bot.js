const mineflayer = require('mineflayer');

let activeBot = null;
let afkInterval = null;
let currentOwner = null;
let lastError = null;

function spawnBot(ip, port, version, username, owner) {
  if (activeBot) {
    lastError = "Şu anda başka bir bot aktif!";
    return;
  }

  lastError = null;
  currentOwner = owner;

  try {
    const bot = mineflayer.createBot({
      host: ip,
      port: parseInt(port),
      username: username,
      version: version
    });

    bot.once('spawn', () => {
      // İstediğin yazılar Minecraft sohbetinde
      bot.chat('§c§lPozBot'); // Kalın kırmızı
      bot.chat('§6PozBot Sunucuya Bağlandı'); // Altın sarısı
      bot.chat('§e9 Saat Açık'); // Sarı

      // Görünmezlik efekti
      bot.chat('/effect give @s invisibility 99999 1 true');

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

    bot.on('death', () => {
      setTimeout(() => {
        if (bot && bot.isDead) bot.emit("respawn");
      }, 3000);
    });

    bot.on('end', () => {
      clearInterval(afkInterval);
      activeBot = null;
      currentOwner = null;
    });

    bot.on('error', (err) => {
      lastError = "Sunucuya bağlanılamadı!";
      clearInterval(afkInterval);
      activeBot = null;
      currentOwner = null;
    });

    activeBot = bot;

  } catch (err) {
    lastError = "Bir hata oluştu.";
    activeBot = null;
    currentOwner = null;
  }
}

function stopBot(owner) {
  if (activeBot && currentOwner === owner) {
    activeBot.chat("Botun Bağlantısı Kesildi");
    setTimeout(() => activeBot.quit(), 1000);
  }
}

function isBotRunning() {
  return activeBot !== null;
}

function getLastError() {
  return lastError;
}

function getCurrentOwner() {
  return currentOwner;
}

module.exports = {
  spawnBot,
  stopBot,
  isBotRunning,
  getLastError,
  getCurrentOwner
};
