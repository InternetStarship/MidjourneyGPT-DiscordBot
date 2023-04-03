/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
})
const openai = new OpenAIApi(configuration)

async function autoUploader(image) {
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

  console.log(conversation)

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

    console.log('* Upload to cloudinary', image, response.root, response.sub)

    return response
  } catch (error) {
    return (
      'Sorry, ran into trouble with the OpenAI API. Error Message: ' + error
    )
  }
}

module.exports = { autoUploader }
