/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
})
const openai = new OpenAIApi(configuration)
const { formulas } = require('../midjourney-formulas.json')

async function generate(message) {
  await message.channel.sendTyping()

  const content = message.content.replace('!!generate ', '')

  const conversation = [
    { role: 'system', content: 'You are a friendly chatbot.' },
    {
      role: 'user',
      content: content,
    },
  ]

  const result = await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversation,
    })
    .catch(error => {
      console.log(`OPENAI ERR: ${error}`)
    })

  const reply =
    '!!\n\n **ChatGPT Response**\n\n' +
    appendArrowToNewLines(result.data.choices[0].message.content)

  message.reply(reply)

  console.log(formulas)
}

function appendArrowToNewLines(str) {
  const lines = str.split('\n')
  const result = lines.map(line => `\> ` + line).join('\n')
  return result
}

module.exports = generate
