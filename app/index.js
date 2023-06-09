/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

require('dotenv').config()

const fs = require('fs')
const path = require('path')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
})

client.commands = new Collection()

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

const { autoUploader } = require('./utils/auto-uploader.js')

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      )
    }
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isAutocomplete()) {
    const autoCompleteCommand = interaction.client.commands.get(
      interaction.commandName
    )

    if (!autoCompleteCommand) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      await autoCompleteCommand.autocomplete(interaction)
    } catch (error) {
      console.error(error)
    }
  }

  if (!interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) return

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  }
})

client.on('messageCreate', async message => {
  if (detectMidjourneyBot(message)) {
    const filePath = './app/config/database.json'
    const data = await fs.readFileSync(filePath, 'utf8')
    const { config } = JSON.parse(data)
    if (config.auto_upload) {
      autoUploader(message.attachments.first().url, message.content, message)
    }
  }
})

function detectMidjourneyBot(message) {
  const pattern = /Image #\d+ <@/
  if (
    message.author.bot &&
    message.attachments &&
    message.author.username === 'Midjourney Bot' &&
    message.mentions?.repliedUser?.username === 'Midjourney Bot' &&
    pattern.test(message.content)
  )
    return true
  return false
}

client.once(Events.ClientReady, () => {
  console.log(
    `\n\n\╔════════════════════════════════╗
║  Discord Bot activated!
║  Features:
║  - ChatGPT  
║  - Midjourney
║  - Cloudinary   
╚════════════════════════════════╝\n\n`
  )
})

client.login(process.env.DISCORD_AUTH_TOKEN)
