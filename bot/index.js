require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if (msg.content === '!poll') {
    await msg.channel.send('A poll has been started for 10 seconds');

    let collected = await msg.channel.awaitMessages(() => true, {
      time: 10000,
    });

    let results = [];
    let iter = collected.values();
    for (val of iter) {
      results.push(val.content);
    }

    let totals = {};
    results.map(item => {
      totals[item] = totals[item] || 0;
      totals[item] = totals[item] + 1;
    });

    await msg.channel.send(`Collected ${JSON.stringify(totals)}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
