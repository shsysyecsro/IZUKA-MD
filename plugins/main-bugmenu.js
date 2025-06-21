const { cmd } = require('../command');
const config = require('../config');
const moment = require('moment-timezone');

const startTime = Date.now();

const formatRuntime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

cmd({
  pattern: 'bugmenu',
  desc: 'Display powerful bug payloads',
  category: 'bug',
  react: '⚠️',
  filename: __filename
}, async (izuka, mek, m, { from, reply }) => {
  try {
    const runtime = formatRuntime(Date.now() - startTime);
    const prefix = config.PREFIX || '.';

    let image = config.MENU_IMAGE_URL || 'https://files.catbox.moe/ia5bih.png';

    const text = `
╔═════『 ⚠️ 𝐁𝐔𝐆 𝐌𝐄𝐍𝐔 ⚠️ 』═════╗
║ 🤖 Bot Name : *𝐈𝐙𝐔𝐊𝐀-𝐌𝐃*
║ 🔠 Prefix   : ${prefix}
║ ⏱ Runtime  : ${runtime}
║ 🧩 Version  : *1.0.0*
╚════════════════════════════╝

📛 *BUG PAYLOADS AVAILABLE*
━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 🔹 ${prefix}bugspam <number> <text>
┃ 🔹 ${prefix}freeze <number>
┃ 🔹 ${prefix}crashwa <number>
┃ 🔹 ${prefix}izuka-kill <number>
┃ 🔹 ${prefix}xdawens <number>
┃ 🔹 ${prefix}xchannel <channel_id>
┃ 🔹 ${prefix}Rey-big-dick <number>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
*⚡ Use responsibly – For dev use only!*
🛡️ Powered by: *𝐃𝐀𝐖𝐄𝐍𝐒 X 𝐑𝐄𝐘 🇭🇹*
    `.trim();

    await izuka.sendMessage(from, {
      image: { url: image },
      caption: text,
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply('❌ Error sending bug menu.');
  }
});
