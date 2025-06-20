const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');

// Small caps function
function toSmallCaps(str) {
  const smallCaps = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.toUpperCase().split('').map(c => smallCaps[c] || c).join('');
}

// Delay function
function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

cmd({
  pattern: "menu",
  alias: ["🍷", "izuka", "allmenu"],
  use: '.menu',
  desc: "Show all bot commands",
  category: "menu",
  react: "🍷",
  filename: __filename
},
async (izuka, mek, m, { from, reply }) => {
  try {
    const sender = (m && m.sender) ? m.sender : (mek?.key?.participant || mek?.key?.remoteJid || 'unknown@s.whatsapp.net');
    const totalCommands = commands.length;
    const date = moment().tz("America/Port-au-Prince").format("dddd, DD MMMM YYYY");

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    let izukamenu = `
╭━━━〘 *IZUKA MD* 〙━━━╮
┃★│ 👤 *ᴜsᴇʀ* : @${m.sender.split("@")[0]}
┃★│ ⏱️ *ʀᴜɴᴛɪᴍᴇ* : ${uptime()}
┃★│ ⚙️ *ᴍᴏᴅᴇ* : ${config.MODE}
┃★│ 💠 *ᴘʀᴇғɪx* : [${config.PREFIX}]
┃★│ 📦 *ᴩʟᴜɢɪɴ* : ${totalCommands}
┃★│ 👨‍💻 *ᴅᴇᴠ* : *DAWENS BOY🇭🇹✨*
┃★│ 🔖 *ᴠᴇʀsɪᴏɴ* : *1.0.0🩸*
┃★│ 📆 *Dᴀᴛᴇ* : ${date}
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷

🩸 *_WELCOME TO IZUKA MD_* 🩸
`;

    // Organize commands by category
    let category = {};
    for (let cmd of commands) {
      if (!cmd.category) continue;
      if (!category[cmd.category]) category[cmd.category] = [];
      category[cmd.category].push(cmd);
    }

    // Build command list in caption (optional, or keep it simple)
    // You can comment this out if you prefer just the buttons:
    const keys = Object.keys(category).sort();
    for (let k of keys) {
      izukamenu += `\n\n┌── 『 ${k.toUpperCase()} MENU 』`;
      const cmds = category[k].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
      cmds.forEach((cmd) => {
        const usage = cmd.pattern.split('|')[0];
        izukamenu += `\n🎀├❃ ${config.PREFIX}${toSmallCaps(usage)}`;
      });
      izukamenu += `\n┗━━━━━━━━━━━━━━❃🇭🇹`;
    }

    // Define buttons with emojis & commands
    const buttons = [
      { buttonId: `${config.PREFIX}ownermenu`, buttonText: { displayText: '👑 Owner Menu' }, type: 1 },
      { buttonId: `${config.PREFIX}allmenu`, buttonText: { displayText: '📋 All Menu' }, type: 1 },
      { buttonId: `${config.PREFIX}groupmenu`, buttonText: { displayText: '👥 Group Menu' }, type: 1 },
      { buttonId: `${config.PREFIX}funmenu`, buttonText: { displayText: '🎉 Fun Menu' }, type: 1 },
      { buttonId: `${config.PREFIX}bugmenu`, buttonText: { displayText: '🐞 Bug Menu' }, type: 1 },
    ];

    // Send menu with buttons
    await izuka.sendMessage(from, {
      image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/a51qw5.jpeg' },
      caption: izukamenu,
      buttons: buttons,
      headerType: 4,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: config.newsletterJid || '120363388484459995@newsletter',
          newsletterName: '𝐈𝐙𝐔𝐊𝐀-𝐌𝐃',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Optional: send voice message (kenbe oswa retire)
    await izuka.sendMessage(from, {
      audio: { url: 'https://files.catbox.moe/m4zrro.mp4' },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
