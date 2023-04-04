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
const fs = require('node:fs')

async function autoUploader(file, content, message) {
  const filePath = './app/config/folders.json'
  const data = await fs.readFileSync(filePath, 'utf8')
  const { folders } = JSON.parse(data)

  const conversation = [
    {
      role: 'system',
      content: `You are the best at creating folder names and creating the perfect folder based on the a piece of text.  Always focus on the subject of the text, skip words like "transparent", "background", "quality" and try to find any subjects. Do not make up your own folder and select from below JSON. Do not include any explanations, only provide a  RFC8259 compliant JSON response following this format without deviation: { "root": "folder-name", "sub": "folder-name", "subsub": "folder-name" }. Here is JSON of root folders, subfolders and subsubfolders to pick from.
      
      ${JSON.stringify(folders)}`,
    },
    {
      role: 'user',
      content: `I want you to give me the root folder and a sub folder and subsub folder for this: "${content}" -  Do not include any explanations, only provide a  RFC8259 compliant JSON response following this format without deviation: { "root": "folder-name", "sub": "folder-name", "subsub": "folder-name" }`,
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
    const path = `${process.env.CLOUDINARY_FOLDER}/${response.root}/${response.sub}/${response.subsub}`

    const reply = await cloudinary.v2.uploader
      .unsigned_upload(file, process.env.CLOUDINARY_UPLOAD_PRESET, {
        folder: path,
      })
      .then(response => {
        return `🤖\n**Auto Uploaded to Cloudinary path: "${path}"**`
      })
      .catch(error => {
        return `🪳\n**Error Uploading** \`\`\`${error}\`\`\` `
      })

    message.reply(reply)
  } catch (error) {
    message.reply(
      '🪳\nSorry, ran into trouble with the OpenAI API. Error Message: ' + error
    )
  }
}

module.exports = { autoUploader }
