const config = require('../config');
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const premiumDir = './data';
const premiumFile = path.join(premiumDir, 'premium.json');

if (!fs.existsSync(premiumDir)) {
  fs.mkdirSync(premiumDir, { recursive: true });
}
if (!fs.existsSync(premiumFile)) {
  fs.writeFileSync(premiumFile, '[]');
}

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

const ownerNumber = config.OWNER_NUMBER || '50942241547';

// 1. Meni Premium
cmd({
  pattern: 'menipremium',
  desc: 'Montre lis kòmand PREMIUM yo',
  category: 'dawensVIP',
  fromMe: false
}, async (message) => {
  const premiumUsers = loadPremiumUsers();
  const senderNumber = message.sender.split('@')[0];

  if (senderNumber !== ownerNumber && !premiumUsers.includes(senderNumber)) {
    return message.reply(
      `❌ *Meni sa a sèlman pou itilizatè PREMIUM.*\n\n💸 *Pri: $2 USD*\n📞 *Kontakte:* @13058962443 pou achte aksè.`,
      { mentions: ['13058962443@s.whatsapp.net'] }
    );
  }

  const menu = `
╭─〔 𓄂⍣⃝ 𝐈𝐙𝐔𝐊𝐀-𝐌𝐃 ✦ MENI PREMIUM 〕─╮
│
│ 📲 .device — Verifye si moun lan sou iOS oswa Android
│ ➕ .addpremium <nimewo> — Ajoute yon itilizatè PREMIUM
│ 🗑️ .removepremium <nimewo> — Retire yon itilizatè PREMIUM
│ 📋 .listpremium — Montre lis itilizatè PREMIUM yo
│
╰─────────────⳹
`.trim();

  await message.reply(menu);
});

// 2. Ajoute itilizatè PREMIUM
cmd({
  pattern: 'addpremium',
  fromMe: true,
  desc: 'Ajoute yon itilizatè nan lis premium.json',
  category: 'dawensVIP'
}, async (message, match) => {
  if (!match && !message.reply_message) return message.reply('❌ Tanpri bay nimewo a oswa fè reply sou mesaj moun lan.');

  const num = match || message.reply_message.sender.split('@')[0];
  let premiumUsers = loadPremiumUsers();

  if (premiumUsers.includes(num)) return message.reply('✅ Itilizatè sa deja gen aksè PREMIUM.');

  premiumUsers.push(num);
  savePremiumUsers(premiumUsers);
  await message.reply(`✅ Nimewo *${num}* ajoute kòm PREMIUM.`);
});

// 3. Retire itilizatè PREMIUM
cmd({
  pattern: 'removepremium',
  fromMe: true,
  desc: 'Retire yon itilizatè nan lis premium.json',
  category: 'dawensVIP'
}, async (message, match) => {
  if (!match && !message.reply_message) return message.reply('❌ Tanpri bay nimewo a oswa fè reply sou mesaj moun lan.');

  const num = match || message.reply_message.sender.split('@')[0];
  let premiumUsers = loadPremiumUsers();

  if (!premiumUsers.includes(num)) return message.reply('❌ Itilizatè sa pa nan lis PREMIUM.');

  premiumUsers = premiumUsers.filter(x => x !== num);
  savePremiumUsers(premiumUsers);
  await message.reply(`🗑️ Nimewo *${num}* retire nan lis PREMIUM.`);
});

// 4. Lis itilizatè PREMIUM
cmd({
  pattern: 'listpremium',
  fromMe: true,
  desc: 'Montre tout itilizatè PREMIUM yo',
  category: 'dawensVIP'
}, async (message) => {
  let premiumUsers = loadPremiumUsers();
  if (premiumUsers.length === 0) return message.reply('📭 Pa gen okenn itilizatè PREMIUM.');

  let list = premiumUsers.map((n, i) => `🔸 ${i + 1}. wa.me/${n}`).join('\n');
  await message.reply(`📋 *Lis itilizatè PREMIUM yo:*\n\n${list}`);
});

// 5. Verifye sistèm aparèy (device)
cmd({
  pattern: 'device',
  desc: 'Verifye si yon moun ap itilize iOS oswa Android.',
  category: 'dawensVIP',
  fromMe: false
}, async (message) => {
  const premiumUsers = loadPremiumUsers();
  const senderNumber = message.sender.split('@')[0];

  if (!premiumUsers.includes(senderNumber) && senderNumber !== ownerNumber) {
    return message.reply(
      `❌ *Kòmand sa a sèlman pou itilizatè PREMIUM.*\n\n💸 *Pri: $2 USD (yon sèl fwa)*\n📞 *Kontakte:* @13058962443 pou aktive aksè Premium.`,
      { mentions: ['13058962443@s.whatsapp.net'] }
    );
  }

  const target = message.mention[0] || message.reply_message?.sender || message.sender;

  try {
    const devices = await message.client.userDevices([target]);
    const device = devices?.[target]?.platform || 'unknown';

    let response = '';
    if (device.toLowerCase().includes('android')) {
      response = '📱 Itilizatè a ap itilize sistèm *Android*.';
    } else if (device.toLowerCase().includes('ios') || device.toLowerCase().includes('iphone')) {
      response = '🍏 Itilizatè a ap itilize sistèm *iOS*.';
    } else {
      response = '❓ Sistèm aparèy itilizatè a pa konnen oswa li pa disponib.';
    }

    await message.reply(`👤 Sib la: @${target.split('@')[0]}\n\n${response}`, {
      mentions: [target]
    });

  } catch (e) {
    await message.reply('❌ Erè pandan wap jwenn enfòmasyon sou aparèy la.');
    console.error(e);
  }
});
