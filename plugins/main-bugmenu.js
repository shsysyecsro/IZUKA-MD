const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: 'bugmenu',
  desc: 'Displays bug commands in a stylish menu with photo',
  category: 'bug',
  react: '🐞',
  filename: __filename
}, async (izuka, mek, m, { from, reply }) => {
  try {
    const bugCaption = `
╭━━━[ 🐞 BUG MENU ]━━━╮
┃
┃ 📍 .bugspam <number> <text>
┃ 📍 .freeze <number>
┃ 📍 .crashwa <number>
┃ 📍 .izuka-kill <number>
┃ 📍 .bugcall <number>
┃
╰━━━━━━━━━━━━━━━━━━━━╯

🛡️ Use responsibly!
🔐 Protected by IZUKA-MD ⚔️
`;

    await izuka.sendMessage(from, {
      image: {
        url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/ia5bih.png'
      },
      caption: bugCaption
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply('❌ Error sending bug menu.');
  }
});
