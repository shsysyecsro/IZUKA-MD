const { cmd } = require('../command');
const config = require('../config');
const moment = require('moment-timezone');
const fs = require('fs');

const startTime = Date.now();

const formatRuntime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

const premiumDir = './data';
const premiumFile = `${premiumDir}/premium.json`;

if (!fs.existsSync(premiumDir)) fs.mkdirSync(premiumDir, { recursive: true });
if (!fs.existsSync(premiumFile)) fs.writeFileSync(premiumFile, '[]');

function loadPremiumUsers() {
  try {
    return JSON.parse(fs.readFileSync(premiumFile));
  } catch {
    return [];
  }
}

const ownerNumber = config.OWNER_NUMBER || '50942241547';

cmd({
  pattern: 'menu2',
  desc: 'Meni Premium ak aksè limite',
  category: 'dawensVIP',
  react: '💎',
  filename: __filename
}, async (izuka, mek, m, { from, reply }) => {
  try {
    const runtime = formatRuntime(Date.now() - startTime);
    const prefix = config.PREFIX || '.';
    const senderNumber = mek.sender?.split('@')[0];
    const premiumUsers = loadPremiumUsers();

    if (senderNumber !== ownerNumber && !premiumUsers.includes(senderNumber)) {
      return await izuka.sendMessage(from, {
        text: `❌ *Meni sa a sèlman pou itilizatè PREMIUM.*\n\n💸 *Pri: $2 USD*\n📞 *Kontakte:* @13058962443 pou achte aksè.`,
        mentions: ['13058962443@s.whatsapp.net']
      }, { quoted: mek });
    }

    const image = config.MENU_IMAGE_URL || 'https://files.catbox.moe/a51qw5.jpeg';

    const caption = `
╔═════『 💎 MENI PREMIUM 』═════╗
║ 🤖 Bot Name : *IZUKA-MD*
║ 🔠 Prefix   : ${prefix}
║ ⏱ Runtime  : ${runtime}
║ 🧩 Aksè     : *PREMIUM Only*
╚════════════════════════════╝

📛 *KÒMAND DISPONIB PREMIUM*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 🔹 ${prefix}device — Verifye sistèm moun lan
┃ 🔹 ${prefix}addpremium <nimewo>
┃ 🔹 ${prefix}removepremium <nimewo>
┃ 🔹 ${prefix}listpremium
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*💡 Pa pataje meni sa!*
🔐 Dev: *DAWENS BOY 🇭🇹*
`.trim();

    await izuka.sendMessage(from, {
      image: { url: image },
      caption
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply('❌ Erè pandan wap voye meni premium lan.');
  }
});
