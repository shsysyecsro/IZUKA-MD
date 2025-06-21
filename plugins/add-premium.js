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
  pattern: 'addpremium',
  fromMe: true,
  desc: 'Ajoute yon itilizatè nan lis premium.json',
  category: 'dawensVIP'
}, async (izuka, mek, m, { reply }) => {
  let num = (m.match && m.match.trim()) || mek.reply_message?.sender?.split('@')[0];

  if (!num) {
    return await izuka.sendMessage(mek.from, { text: '❌ Tanpri bay nimewo a oswa fè reply sou mesaj moun lan.' }, { quoted: mek });
  }

  num = num.replace(/\D/g, '');

  if (num.length !== 11) {
    return await izuka.sendMessage(mek.from, { text: '❌ Nimewo a dwe gen egzakteman 11 chif.' }, { quoted: mek });
  }

  const premiumUsers = loadPremiumUsers();
  if (premiumUsers.includes(num)) {
    return await izuka.sendMessage(mek.from, { text: '✅ Itilizatè sa deja gen aksè PREMIUM.' }, { quoted: mek });
  }

  premiumUsers.push(num);
  savePremiumUsers(premiumUsers);

  await izuka.sendMessage(mek.from, { text: `✅ Nimewo *${num}* ajoute kòm PREMIUM.` }, { quoted: mek });
});
