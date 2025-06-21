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

const ownerNumber = '50942241547';

// 1. Premium menu command
cmd({
  pattern: 'premiummenu',
  desc: 'Show the list of PREMIUM commands',
  category: 'dawensVIP',
  fromMe: false
}, async (message) => {
  const premiumUsers = loadPremiumUsers();
  const senderNumber = message.sender.split('@')[0];

  if (senderNumber !== ownerNumber && !premiumUsers.includes(senderNumber)) {
    return message.reply(
      `❌ *This menu is restricted to Premium Users only.*\n\n💸 *Price: $2 USD*\n📞 *Contact:* @13058962443 to buy access.`,
      { mentions: ['13058962443@s.whatsapp.net'] }
    );
  }

  const menu = `
╭─〔 𓄂⍣⃝ 𝐈𝐙𝐔𝐊𝐀-𝐌𝐃 ✦ PREMIUM MENU 〕─╮
│
│ 📲 .device — Check if user is on iOS or Android
│ ➕ .addpremium <number> — Add a PREMIUM user
│ 🗑️ .removepremium <number> — Remove a PREMIUM user
│ 📋 .listpremium — List all PREMIUM users
│
╰─────────────⳹
`.trim();

  await message.reply(menu);
});

// 2. Add premium user command
cmd({
  pattern: 'addpremium',
  fromMe: true,
  desc: 'Add a user to premium.json',
  category: 'dawensVIP'
}, async (message, match) => {
  if (!match && !message.reply_message) return message.reply('❌ Please provide a number or reply to a user.');

  const num = match || message.reply_message.sender.split('@')[0];
  let premiumUsers = loadPremiumUsers();

  if (premiumUsers.includes(num)) return message.reply('✅ This user already has premium access.');

  premiumUsers.push(num);
  savePremiumUsers(premiumUsers);
  await message.reply(`✅ Number *${num}* has been added as PREMIUM.`);
});

// 3. Remove premium user command
cmd({
  pattern: 'removepremium',
  fromMe: true,
  desc: 'Remove a user from premium.json',
  category: 'dawensVIP'
}, async (message, match) => {
  if (!match && !message.reply_message) return message.reply('❌ Please provide a number or reply to a user.');

  const num = match || message.reply_message.sender.split('@')[0];
  let premiumUsers = loadPremiumUsers();

  if (!premiumUsers.includes(num)) return message.reply('❌ This user is not in the PREMIUM list.');

  premiumUsers = premiumUsers.filter(x => x !== num);
  savePremiumUsers(premiumUsers);
  await message.reply(`🗑️ Number *${num}* has been removed from PREMIUM.`);
});

// 4. List premium users command
cmd({
  pattern: 'listpremium',
  fromMe: true,
  desc: 'View all PREMIUM users',
  category: 'dawensVIP'
}, async (message) => {
  let premiumUsers = loadPremiumUsers();
  if (premiumUsers.length === 0) return message.reply('📭 There are no PREMIUM users.');

  let list = premiumUsers.map((n, i) => `🔸 ${i + 1}. wa.me/${n}`).join('\n');
  await message.reply(`📋 *List of PREMIUM Users:*\n\n${list}`);
});

// 5. Device check command
cmd({
  pattern: 'device',
  desc: 'Check if someone is using iOS or Android.',
  category: 'dawensVIP',
  fromMe: false
}, async (message) => {
  const premiumUsers = loadPremiumUsers();
  const senderNumber = message.sender.split('@')[0];

  if (!premiumUsers.includes(senderNumber) && senderNumber !== ownerNumber) {
    return message.reply(
      `❌ *This command is premium-only.*\n\n💸 *Price: $2 USD (one-time)*\n📞 *Contact:* @13058962443 to activate Premium Access.`,
      { mentions: ['13058962443@s.whatsapp.net'] }
    );
  }

  const target = message.mention[0] || message.reply_message?.sender || message.sender;

  try {
    const devices = await message.client.userDevices([target]);
    const device = devices?.[target]?.platform || 'unknown';

    let response = '';
    if (device.toLowerCase().includes('android')) {
      response = '📱 The target is using an *Android* system.';
    } else if (device.toLowerCase().includes('ios') || device.toLowerCase().includes('iphone')) {
      response = '🍏 The target is using an *iOS* system.';
    } else {
      response = '❓ The target device is unknown or unavailable.';
    }

    await message.reply(`👤 Target: @${target.split('@')[0]}\n\n${response}`, {
      mentions: [target]
    });

  } catch (e) {
    await message.reply('❌ Error fetching device info.');
    console.error(e);
  }
});
