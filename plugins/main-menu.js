const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');

// Convert normal text to small caps
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
}, async (izuka, mek, m, { from, reply }) => {
  try {
    const sender = m?.sender || mek?.key?.participant || mek?.key?.remoteJid || 'unknown@s.whatsapp.net';
    const totalCommands = commands.length;
    const date = moment().tz("America/Port-au-Prince").format("dddd, DD MMMM YYYY");

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    let menuText = `
╭━━━〘 *IZUKA MD* 〙━━━╮
┃★│ 👤 *User* : @${m.sender.split("@")[0]}
┃★│ ⏱️ *Uptime* : ${uptime()}
┃★│ ⚙️ *Mode* : ${config.MODE}
┃★│ 💠 *Prefix* : [${config.PREFIX}]
┃★│ 📦 *Plugins* : ${totalCommands}
┃★│ 👨‍💻 *Dev* : *DAWENS BOY🇭🇹✨*
┃★│ 🔖 *Version* : *1.0.0🩸*
┃★│ 📆 *Date* : ${date}
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

    const keys = Object.keys(category).sort();
    for (let k of keys) {
      menuText += `\n\n┌── 『 ${k.toUpperCase()} MENU 』`;
      const cmds = category[k].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
      for (let c of cmds) {
        const usage = c.pattern.split('|')[0];
        menuText += `\n🎀├❃ ${config.PREFIX}${toSmallCaps(usage)}`;
      }
      menuText += `\n┗━━━━━━━━━━━━━━❃🇭🇹`;
    }

    // Step-by-step animation
    const animationSteps = [
      '𝗟𝗼𝗮', '𝗗𝗶𝗻', '𝗚', '(█▒▒▒▒▒▒▒▒▒)', '𝗟𝗼𝗮𝗱𝗶𝗻𝗴...'
    ];

    for (let step of animationSteps) {
      await izuka.sendMessage(from, { text: step }, { quoted: mek });
      await delay(500);
      await izuka.sendMessage(from, { text: '\u2060' }); // invisible char to remove previous one visually
    }

    // Final "ready for war" text
    await izuka.sendMessage(from, {
      text: '*➶ℵ𝐈𝐙𝐔𝐊𝐀♛𝐌𝐃ℵ➴ READY FOR WAR*'
    }, { quoted: mek });
    await delay(1000);

    // Send the main menu image + text
    await izuka.sendMessage(from, {
      image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/a51qw5.jpeg' },
      caption: menuText,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: config.newsletterJid || '120363401051937059@newsletter',
          newsletterName: '𝐈𝐙𝐔𝐊𝐀-𝐌𝐃',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Voice (PTT) message
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
