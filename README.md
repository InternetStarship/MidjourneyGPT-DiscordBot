# MidjourneyGPT - Private Discord Bot

This is a private Discord bot for the MidjourneyGPT Discord server. It is not intended for public use.

## Setup

Run locally:

```
npm install
npm start
```

## Usage

Commands:

#### `!!ask`

You must provide your messages like this:

```
!!ask type [subject=Burger] [style=modern]
```

* type = the type of formula, ex. "icon" or "background"

Based on the options available for the formulas in the `/app/midjourney-formulas.json` file.

### Environment Variables

```
# Prefix
COMMAND_PREFIX=!!

# Discord
DISCORD_AUTH_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=

# Cloudinary
CLOUDINARY_URL=
CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_FOLDER=

# ChatGPT
CHATGPT_API_KEY=
```

## ChatGPT API

## Cloudinary API

Create unsigned present and create a folder.

### Getting Guild ID

To get the server ID for the first parameter, open Discord, go to Settings > Advanced and enable developer mode. Then, right-click on the server title and select "Copy ID" to get the guild ID.