import presetWeapp from 'unocss-preset-weapp'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'

const { presetWeappAttributify, transformerAttributify } = extractorAttributify()

export default {
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp(),
    // attributify autocomplete
    presetWeappAttributify(),
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500_10',
      'center': 'flex justify-center items-center',
      'flex-center-between':'flex items-center justify-between',
      'border-bottom-#EBEBEB':'border-t-none border-l-none border-r-none border-solid border-b border-b-#EBEBEB last:border-none',
      'border-bottom-#333333':'border-t-none border-l-none border-r-none border-solid border-b border-b-#333333 last:border-none',
      'border-right':'border-t-none border-b-none border-l-none border-solid border-r border-r-#333333'
    },
  ],

  transformers: [
    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify(),

    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ]
}