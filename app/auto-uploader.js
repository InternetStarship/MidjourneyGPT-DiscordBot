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
  const filePath = './app/database.json'
  const data = await fs.readFileSync(filePath, 'utf8')
  const { formulas } = JSON.parse(data)

  const conversation = [
    {
      role: 'system',
      content: `You are the best at creating folder names and creating the perfect folder name based on the a piece of text. You can pick from the following folders as root and then create a sub-folder that best suites the text. Always lowercase folder names. Always use - instead of space for folder names. Always pick single words for folder names. Always focus on the subject of the text, skip words like "transparent", "background", "quality" and try to find any subjects. Root folders choices (${JSON.stringify(
        Object.entries(formulas).map(([key, value]) => {
          return key
        })
      )}). Make the subsub folder more specific while sub folder is more general. When possible make folder names plural except root folder name. Always make simple names, as simple as possible. Do not include any explanations, only provide a  RFC8259 compliant JSON response following this format without deviation: { "root": "folder", "sub": "folder", "subsub": "folder" }`,
    },
    {
      role: 'user',
      content: `I want you to give me the root folder and a sub folder for this: "${content}" -  Do not include any explanations, only provide a  RFC8259 compliant JSON response following this format without deviation: { "root": "folder", "sub": "folder", "subsub": "folder" }`,
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
        return `**Auto Uploaded to Cloudinary path: "${path}"**`
      })
      .catch(error => {
        return `**Error Uploading** \`\`\`${error}\`\`\` `
      })

    message.reply(reply)
  } catch (error) {
    message.reply(
      'Sorry, ran into trouble with the OpenAI API. Error Message: ' + error
    )
  }
}

module.exports = { autoUploader }
