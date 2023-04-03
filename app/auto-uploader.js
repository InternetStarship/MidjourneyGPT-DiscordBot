/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
})
const openai = new OpenAIApi(configuration)
const cloudinary = require('cloudinary')

async function autoUploader(file) {
  const conversation = [
    {
      role: 'system',
      content: `You are the best at creating folder names and creating the perfect folder name based on the a piece of text. You can pick from the following folders as root and then create a sub-folder that best suites the text. Root folders choices (${JSON.stringify(
        Object.entries(formulas).map(([key, value]) => {
          return key
        })
      )}) You will always return ONLY your answer as raw JSON like this: { "root": "folder", "sub": "folder" }`,
    },
    {
      role: 'user',
      content: `I want you to give me the root folder and a sub folder for this: "${content}"`,
    },
  ]

  const chatgpt = await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversation,
    })
    .catch(error => {
      return (
        'Sorry, ran into trouble with the OpenAI API. Error Message: ' + error
      )
    })

  try {
    const response = JSON.parse(chatgpt.data.choices[0].message.content)
    const path = `${process.env.CLOUDINARY_FOLDER}/${response.root}/${response.root}`

    const reply = await cloudinary.v2.uploader
      .unsigned_upload(file, process.env.CLOUDINARY_UPLOAD_PRESET, {
        folder: path,
      })
      .then(response => {
        return `**Auto Uploaded to ${path}**`
      })
      .catch(error => {
        return `**Error Uploading** \`\`\`${error}\`\`\` `
      })

    interaction.reply(reply)
  } catch (error) {
    return (
      'Sorry, ran into trouble with the OpenAI API. Error Message: ' + error
    )
  }
}

module.exports = { autoUploader }
