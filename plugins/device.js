const { cmd } = require('../command');

cmd({
  pattern: 'device',
  desc: 'Detekte ki aparèy moun lan ap itilize',
  category: 'spam',
  react: '📲',
  filename: __filename
}, async (client, message) => {
  try {
    const allowedUsers = ['13058962443@s.whatsapp.net', '50942241547@s.whatsapp.net'];
    const sender = message.key.fromMe ? client.user.id : message.key.participant || message.key.remoteJid;

    // Verifye si moun lan otorize
    if (!allowedUsers.includes(sender)) {
      return await client.sendMessage(message.key.remoteJid, {
        text: '_⛔ Ou pa otorize pou itilize sa._'
      }, { quoted: message });
    }

    // Detekte aparèy moun lan
    const msgId = message.key.id;
    let deviceType = 'Unknown';

    if (msgId?.startsWith('3EB0')) {
      deviceType = 'Android';
    } else if (msgId?.startsWith('3EB1')) {
      deviceType = 'iPhone';
    } else if (msgId?.includes(':')) {
      deviceType = 'WhatsApp Web';
    }

    await client.sendMessage(message.key.remoteJid, {
      text: `_📲 This person is using a ${deviceType} device._`
    }, { quoted: message });

  } catch (err) {
    await client.sendMessage(message.key.remoteJid, {
      text: `_❌ Error: ${err.message}_`
    }, { quoted: message });
  }
});
