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

cmd({
  pattern: 'listpremium',
  fromMe: true,
  desc: 'Montre tout itilizatè PREMIUM yo',
  category: 'dawensVIP'
}, async (izuka, mek, m, { reply }) => {
  const premiumUsers = loadPremiumUsers();

  if (premiumUsers.length === 0) {
    return await izuka.sendMessage(mek.from, { text: '📭 Pa gen okenn itilizatè PREMIUM.' }, { quoted: mek });
  }

  const list = premiumUsers
    .map((num, i) => `🔸 ${i + 1}. wa.me/${num}`)
    .join('\n');

  await izuka.sendMessage(mek.from, {
    text: `📋 *Lis itilizatè PREMIUM yo:*\n\n${list}`
  }, { quoted: mek });
});
