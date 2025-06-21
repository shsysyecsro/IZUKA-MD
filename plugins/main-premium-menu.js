const config = require('../config');
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const premiumDir = './data';
const premiumFile = path.join(premiumDir, 'premium.json');

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

const ownerNumber = config.OWNER_NUMBER || '50942241547';

// 1. Meni Premium
cmd({
  pattern: 'menipremium',
  desc: 'Montre lis kòmand PREMIUM yo',
  category: 'dawensVIP',
  fromMe: false
}, async (message) => {
  const premiumUsers = loadPremiumUsers();
  const senderNumber = message.sender?.split('@')[0];

  if (senderNumber !== ownerNumber && !premiumUsers.includes(senderNumber)) {
    return await message.sendMessage(
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
╰─────────────⳹`.trim();

  await message.sendMessage(menu);
});

// 2. Ajoute PREMIUM
cmd({
  pattern: 'addpremium',
  fromMe: true,
  desc: 'Ajoute yon itilizatè nan lis premium.json',
  category: 'dawensVIP'
}, async (message, match) => {
  if (!match && !message.reply_message) return await message.sendMessage('❌ Tanpri bay nimewo a oswa fè reply sou mesaj moun lan.');
  const num = match || message.reply_message.sender.split('@')[0];

  let premiumUsers = loadPremiumUsers();
  if (premiumUsers.includes(num)) return await message.sendMessage('✅ Itilizatè sa deja gen aksè PREMIUM.');

  premiumUsers.push(num);
  savePremiumUsers(premiumUsers);
  await message.sendMessage(`✅ Nimewo *${num}* ajoute kòm PREMIUM.`);
});

// 3. Retire PREMIUM
cmd({
  pattern: 'removepremium',
  fromMe: true,
  desc: 'Retire yon itilizatè nan lis premium.json',
  category: 'dawensVIP'
}, async (message, match) => {
  if (!match && !message.reply_message) return await message.sendMessage('❌ Tanpri bay nimewo a oswa fè reply sou mesaj moun lan.');
  const num = match || message.reply_message.sender.split('@')[0];

  let premiumUsers = loadPremiumUsers();
  if (!premiumUsers.includes(num)) return await message.sendMessage('❌ Itilizatè sa pa nan lis PREMIUM.');

  premiumUsers = premiumUsers.filter(x => x !== num);
  savePremiumUsers(premiumUsers);
  await message.sendMessage(`🗑️ Nimewo *${num}* retire nan lis PREMIUM.`);
});

// 4. Lis PREMIUM
cmd({
  pattern: 'listpremium',
  fromMe: true,
  desc: 'Montre tout itilizatè PREMIUM yo',
  category: 'dawensVIP'
}, async (message) => {
  let premiumUsers = loadPremiumUsers();
  if (premiumUsers.length === 0) return await message.sendMessage('📭 Pa gen okenn itilizatè PREMIUM.');

  let list = premiumUsers.map((n, i) => `🔸 ${i + 1}. wa.me/${n}`).join('\n');
  await message.sendMessage(`📋 *Lis itilizatè PREMIUM yo:*\n\n${list}`);
});

// 5. Device Check
cmd({
  pattern: 'device',
  desc: 'Verifye si yon moun ap itilize iOS oswa Android.',
  category: 'dawensVIP',
  fromMe: false
}, async (message) => {
  const premiumUsers = loadPremiumUsers();
  const senderNumber = message.sender?.split('@')[0];
  if (!premiumUsers.includes(senderNumber) && senderNumber !== ownerNumber) {
    return await message.sendMessage(
      `❌ *Kòmand sa a sèlman pou itilizatè PREMIUM.*\n\n💸 *Pri: $2 USD*\n📞 *Kontakte:* @13058962443 pou aktive aksè Premium.`,
      { mentions: ['13058962443@s.whatsapp.net'] }
    );
  }

  const target = message.mentions?.[0] || message.reply_message?.sender || message.sender;

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

    await message.sendMessage(`👤 Sib la: @${target.split('@')[0]}\n\n${response}`, {
      mentions: [target]
    });
  } catch (e) {
    await message.sendMessage('❌ Erè pandan wap jwenn enfòmasyon sou aparèy la.');
    console.error(e);
  }
});
