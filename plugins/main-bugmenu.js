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
  desc: 'Displays powerful bug commands',
  category: 'bug',
  react: '🐞',
  filename: __filename
}, async (izuka, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;
    const runtime = formatRuntime(Date.now() - startTime);

    let profilePictureUrl = 'https://files.catbox.moe/ia5bih.png'; // Default image
    try {
      const pp = await izuka.profilePictureUrl(m.sender, 'image');
      if (pp) profilePictureUrl = pp;
    } catch (e) {
      console.error("❌ Erè foto pwofil:", e);
    }

    const bugCaption = `
╭───────────────⭓
│ ʙᴏᴛ : *𝐈𝐙𝐔𝐊𝐀-𝐌𝐃*
│ ᴘʀᴇғɪx : ${prefix}
│ ʀᴜɴᴛɪᴍᴇ : ${runtime}
│ ᴍᴇɴᴜ : 𝗕𝗨𝗚-𝗠𝗘𝗡𝗨
│ ᴠᴇʀ : *1.𝟶.𝟶*
╰───────────────⭓
➤ .bugspam <number> <text>
➤ .freeze <number>
➤ .crashwa <number>
➤ .izuka-kill <number>
➤ .xdawens <number>
────────────────────
⚡ 𝐃𝐀𝐖𝐄𝐍𝐒 𝐁𝐎𝐘 𝐓𝐄𝐂𝐇 ⚡
────────────────────
`;

    await izuka.sendMessage(from, {
      image: { url: profilePictureUrl },
      caption: bugCaption.trim()
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply('❌ Error while sending bug menu.');
  }
});
