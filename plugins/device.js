const { cmd } = require('../command');
const config = require('../config');
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

const ownerNumber = config.OWNER_NUMBER || '50942241547';

cmd({
  pattern: 'device',
  desc: 'Verifye si yon moun ap itilize iOS oswa Android',
  category: 'dawensVIP',
  react: '📲',
  filename: __filename
}, async (izuka, mek, m, { from, reply }) => {
  try {
    const senderNumber = mek.sender?.split('@')[0];
    const premiumUsers = loadPremiumUsers();

    if (senderNumber !== ownerNumber && !premiumUsers.includes(senderNumber)) {
      return await izuka.sendMessage(from, {
        text: `❌ *Kòmand sa a sèlman pou itilizatè PREMIUM.*\n\n💸 *Pri: $2 USD*\n📞 *Kontakte:* @13058962443 pou aktive aksè Premium.`,
        mentions: ['13058962443@s.whatsapp.net']
      }, { quoted: mek });
    }

    // Target kapab yon mention, reply, oswa moun ki voye mesaj la
    const target = mek.mentions?.[0] || mek.reply_message?.sender || mek.sender;

    const devices = await mek.client.userDevices([target]);
    const device = devices?.[target]?.platform || 'unknown';

    let response = '';
    if (device.toLowerCase().includes('android')) {
      response = '📱 Itilizatè a ap itilize sistèm *Android*.';
    } else if (device.toLowerCase().includes('ios') || device.toLowerCase().includes('iphone')) {
      response = '🍏 Itilizatè a ap itilize sistèm *iOS*.';
    } else {
      response = '❓ Sistèm aparèy itilizatè a pa detekte oswa pa disponib.';
    }

    await izuka.sendMessage(from, {
      text: `👤 Sib la: @${target.split('@')[0]}\n\n${response}`,
      mentions: [target]
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply('❌ Erè pandan wap detekte aparèy la.');
  }
});
