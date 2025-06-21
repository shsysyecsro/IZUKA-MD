const { cmd } = require('../command');
const fs = require('fs');

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

function savePremiumUsers(users) {
  fs.writeFileSync(premiumFile, JSON.stringify(users, null, 2));
}

cmd({
  pattern: 'removepremium',
  fromMe: true,
  desc: 'Retire yon itilizatè nan lis premium.json',
  category: 'dawensVIP'
}, async (izuka, mek, m, { reply }) => {
  // Jwenn nimewo swa nan paramèt oswa nan reply
  let num = (m.match && m.match.trim()) || mek.reply_message?.sender?.split('@')[0];

  if (!num) {
    return await izuka.sendMessage(mek.from, { text: '❌ Tanpri bay nimewo a oswa fè reply sou mesaj moun lan.' }, { quoted: mek });
  }

  // Retire tout karaktè ki pa nimewo
  num = num.replace(/\D/g, '');

  // Validasyon: Nimewo dwe gen egzak 11 chif
  if (num.length !== 11) {
    return await izuka.sendMessage(mek.from, { text: '❌ Nimewo a dwe gen egzakteman 11 chif.' }, { quoted: mek });
  }

  let premiumUsers = loadPremiumUsers();
  if (!premiumUsers.includes(num)) {
    return await izuka.sendMessage(mek.from, { text: '❌ Itilizatè sa pa nan lis PREMIUM.' }, { quoted: mek });
  }

  premiumUsers = premiumUsers.filter(x => x !== num);
  savePremiumUsers(premiumUsers);

  await izuka.sendMessage(mek.from, { text: `🗑️ Nimewo *${num}* retire nan lis PREMIUM.` }, { quoted: mek });
});
