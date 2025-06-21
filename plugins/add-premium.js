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
  // Jwenn nimewo swa nan paramèt oswa nan reply
  let num = (m.match && m.match.trim()) || mek.reply_message?.sender?.split('@')[0];

  if (!num) {
    return await izuka.sendMessage(mek.from, { text: '❌ Tanpri bay nimewo a oswa fè reply sou mesaj moun lan.' }, { quoted: mek });
  }

  // Retire espas blan ak karaktè pa valid
  num = num.replace(/\D/g, '');

  // Validasyon nimewo: minimòm 8 oswa 10 chif (chwazi yon sèl)
  if (num.length < 8) {
    return await izuka.sendMessage(mek.from, { text: '❌ Nimewo a dwe gen omwen 8 chif.' }, { quoted: mek });
  }
  // Si ou vle 10 chif olye, ranplase 8 pa 10 anlè

  const premiumUsers = loadPremiumUsers();
  if (premiumUsers.includes(num)) {
    return await izuka.sendMessage(mek.from, { text: '✅ Itilizatè sa deja gen aksè PREMIUM.' }, { quoted: mek });
  }

  premiumUsers.push(num);
  savePremiumUsers(premiumUsers);

  await izuka.sendMessage(mek.from, { text: `✅ Nimewo *${num}* ajoute kòm PREMIUM.` }, { quoted: mek });
});
