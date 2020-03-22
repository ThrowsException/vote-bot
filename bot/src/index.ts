import { Client, Message } from 'discord.js';
import { ObjectId } from 'mongodb';
import { connect, findResults, insertResults } from './db';

require('dotenv').config();

const client = new Client();
connect();

client.on('ready', async () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
});

/**
 * run command !poll name time
 */
client.on('message', async (msg: Message) => {
  if (msg.content.match(/^!poll/)) {
    let groups = msg.content.match(/^!poll (?<name>.*) (?<time>.*)/)?.groups;
    console.log(groups);
    if (!groups) {
      await msg.channel.send('You need to name the quiz and give a time');
      return;
    }

    await msg.channel.send(
      `A poll has been started for ${+groups.time || 10} seconds`
    );

    let collected = await msg.channel.awaitMessages(() => true, {
      time: +groups.time * 1000 || 10000,
    });

    let totals: { [key: string]: number } = {};
    collected.forEach(item => {
      totals[item.content] = totals[item.content] || 0;
      totals[item.content] = totals[item.content] + 1;
    });

    insertResults(groups?.name, totals);

    await msg.channel.send(`Collected ${JSON.stringify(totals)}`);
  }

  if (msg.content.match(/!results .*/)) {
    console.log(msg.content.split(' ')[1]);

    const results = findResults(new ObjectId(msg.content.split(' ')[1]));

    msg.channel.send(
      `Heres the results from the poll ${JSON.stringify(results)}`
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
