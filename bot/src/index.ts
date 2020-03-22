import { Client, Message } from 'discord.js';

require('dotenv').config();

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on('message', async (msg: Message) => {
  if (msg.content === '!poll') {
    await msg.channel.send('A poll has been started for 10 seconds');

    let collected = await msg.channel.awaitMessages(() => true, {
      time: 10000,
    });

    let totals: { [key: string]: number } = {};
    collected.forEach(item => {
      const current = totals[item.content];
      totals[item.content] = current || 0;
      totals[item.content] = current + 1;
    });

    await msg.channel.send(`Collected ${JSON.stringify(totals)}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
