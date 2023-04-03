/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

require('dotenv').config()
const { Client, Events, GatewayIntentBits } = require('discord.js')
const requireDir = require('require-dir')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
})
const commands = requireDir('./commands')
const command_prefix = process.env.COMMAND_PREFIX

client.once(Events.ClientReady, () => console.log('Discord Bot is Ready'))

client.on('messageCreate', async message => {
  // console.log(message)
  if (!message.author.bot && message.content.startsWith(command_prefix)) {
    await runCommand(message)
  }
})

const runCommand = async message => {
  let command = message.content.slice(command_prefix.length).trim()
  command = command.split(' ')[0]
  commands[command]
    ? commands[command](message)
    : message.channel.send('Invalid command!')
}

client.login(process.env.DISCORD_AUTH_TOKEN)
