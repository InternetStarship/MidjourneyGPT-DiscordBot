/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
})
const openai = new OpenAIApi(configuration)
const { formulas } = require('../../database/midjourney-formulas.json')
const options = Object.entries(formulas).map(([key, value]) => {
  return {
    name: key,
    value: key,
  }
})

async function askChatGPTForFolder() {
  const conversation = [
    {
      role: 'system',
      content:
        'You a creative writer and excel at find descriptive ways to change words. You take any sentence and make variations of sentence where any word that has brackets you will find various words to use. Example, a sentence like "a photo of [cat] with [type of lighting]" could be turned into  2 variations like this: 1: "a photo of a large cat with dark lighting" 2: "a photo of a fluffy orange cat with bright contrast lighting". You only provide JSON output. Make sure to always change what is inside bracket for each variation. Always change each word, each time, not just one of them, but all of them. Only output JSON like this: {"variations": ["variation 1", "variation 2"]}',
    },
    {
      role: 'user',
      content: `I want ${count} variations of the following as JSON (never append a period at end of sentence or capitalize, keep all lower case). Only raw text JSON: "${content}"`,
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
    const response = chatgpt.data.choices[0].message.content

    return response
  } catch (error) {
    return (
      'Sorry, ran into trouble with the OpenAI API. Error Message: ' + error
    )
  }
}
