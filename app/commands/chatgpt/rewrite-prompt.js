/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')

const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
})
const openai = new OpenAIApi(configuration)

const data = new SlashCommandBuilder()
  .setName('prompt-rewrite')
  .setDescription('Rewrite a prompt with ChatGPT for Midjourney')

data.addStringOption(option =>
  option
    .setName('draft')
    .setDescription(`Write your prompt draft for ChatGPT to improve.`)
    .setRequired(true)
)

module.exports = {
  data: data,
  async execute(interaction) {
    const draft = interaction.options.getString('draft')

    if (!draft) {
      return interaction.reply(`You must provide a draft.`)
    }

    await interaction.deferReply()
    await interaction.editReply(await generate(draft))
  },
}

const generate = async draft => {
  const conversation = [
    {
      role: 'system',
      content: `You help create text prompts templates for an AI text-to-image software called Midjourney. You will take concepts and make 4 variations of it as a Midjourney prompt. Always return your response inside of triple backtick code blocks. Do not provide explanation. Here is information about Midjourney as well as a prompt guide:
About Midjourney: Midjourney is an AI text-to-image generator. As the brand's website states, it aims to 'explore new mediums of thought and expanding the imaginative powers of the human species'. Midjourney asks you to input a worded prompt for an image, for example 'a fox wearing a top hat in the style of a Roald Dahl illustration' and in a few seconds, you'll be returned multiple attempts at this image in the form of a 4x4 image grid. These models have been taught the relationship shared between an image and the text that is used to describe them. The team behind Midjourney are now on the fifth iteration (V5). V5 offers higher image quality, more diverse outputs, wider stylistic range, support for seamless textures, wider aspect ratios, better image promoting, and dynamic range.
Midjourney V5 Prompt Guide:
To use Midjourney V5, add the --v 5 parameter to the end of a prompt. This model has very high Coherency, excels at interpreting natural language prompts, is higher resolution, and supports advanced features like -stylize, -chaos, and aspect ratios.
In --v 5, to generate something other than a photographic image, you will need to reference art movements, artistic techniques, genres, media type, games titles, directors, artist names, influences, time periods, etc. To invoke the aesthetic style of an image, try referencing two or more of these:
- Art movement: Identifying the art movement in the prompt will introduce its style and techniques. Examples include Impressionism, Surrealism, or Pop Art.
- Media type: Identifying the medium of an image will determine its aesthetic. Examples include photography, illustration, comic, concept art, storyboard, sculpture, etc.
- Media title: - Identifying a media influence will influence its look. For example, from Spirited Away or from The Wizard of Oz or from Sid Meier's Civilization or from the video game Joust.
- Artist name: Referencing the name or the work of a specific artist will roughly invoke their unique style. Examples include Vincent van Gogh, Frida Kahlo, or Banksy.
- Technique: Referencing techniques will add that style to the image. Examples include impasto, pencil sketch, watercolor, or digital art.
- Time period: Identifying the historical context of an image will invoke its aesthetic. For example, images from the Renaissance, Baroque, or Modernist periods.
- Geographic location: Referencing regions and countries will influence style. Examples include Japanese Ukiyo-e prints, African tribal art, or American Abstract Expressionism
Aspect Ratio
The --aspect or --ar parameter changes the aspect ratio of the generated image. An aspect ratio is the width-to-height ratio of an image. It is typically expressed as two numbers separated by a colon, such as 7:4 or 4:3. The default aspect ratio is 1:1.
--aspect must use whole numbers. Use 139:100 instead of 1.39:1.
The aspect ratio impacts the shape and composition of a generated image.
To use aspect ratios, Add --aspect <value>:<value>, or --ar <value>:<value> to the end of your prompt
Stylize
Midjourney has been trained to produce images that favor artistic color, composition, and forms. The --stylize or --s parameter influences how strongly this training is applied. Low stylization values produce images that closely match the prompt but are less artistic. High stylization values create images that are very artistic but less connected to the prompt.
To use stylize, Add --stylize <value> or --s <value> to the end of your prompt.
Midjourney V5 Prompt Examples:
Now that you know how to prompt in Midjourney V5, here are some example prompts that put all of that information together:

Zack Snyder's Wonderwoman portrait in chiaroscuro black & white graphite pencil, hard-key side light, golden armor, fierce eyes, moody, wet, rain, shiny, hyper realism, cinematic lighting

Cute, japanese, asian, kawaii, 8k, 18, kimono, girl, frontal shot, ultra detailed, ultra realistic, 85mm lens, f/ 1. 8, accent lighting, portrait, face, extreme close up, public street, day, skinny, hair ponytail, pastel, blonde, goddess
incredibly powerful Anime Girl, created by Katsuhiro Otomo + Rumiko Takahashi, Movie poster style, box office hit, a masterpiece of storytelling, main character center focus, monsters + mech creatures locked in combat, nuclear explosions paint sky, highly detailed 8k, 4k, intricate, detailed --c 40

Pointilism + impasto, diffrachromatic glowing ethereal light, Ilya Kuvshinov + Karmen Loh + Klimt + Akihiko Yoshida, gorgeous heavenly girl laying on her back in the moments after pure ecstasy, full body, skin --ar 16:9 --s 300

Street style portrait of a female wearing a sunglass and a gray long-sleeve top in middle of foreground, background is brutalist style HDB apartments in Singapore, evening, shot on Kodak Portra
a close up of a person wearing a helmet, cyberpunk art, inspired by Tom Whalen, beautiful android woman, orange metal ears, vector artwork, martin ansin --ar 1:1 --c 100 --s 0.5`,
    },
    {
      role: 'user',
      content: `Give 4 Midjourney prompts for this: "${draft}" 

**Prompt 1:**
\`\`\`/imagine prompt: [replace with prompt here]\`\`\`
**Prompt 2:**
\`\`\`/imagine prompt: [replace with prompt here]\`\`\`
**Prompt 3:**
\`\`\`/imagine prompt: [replace with prompt here]\`\`\`
**Prompt 4:**
\`\`\`/imagine prompt: [replace with prompt here]\`\`\`
      `,
    },
  ]

  const chatgpt = await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversation,
    })
    .catch(error => {
      return (
        '🪳\nSorry, ran into trouble with the OpenAI API. Error Message: ' +
        error
      )
    })

  return chatgpt.data.choices[0].message.content
}
