const { readFile } = require('fs')
const { promisify } = require('util')

const read = async (file, context) => {
  const asyncRead = promisify(readFile)

  const results = JSON.parse(await asyncRead(file, 'utf-8'))

  const errors = []
  results.testResults.filter(unit => {
    if (unit.status === 'failed') {
      const { name, message } = unit
      errors.push(`${name} \n ${message}`)
    }
  })

  const blocks = [
    {
      type: 'divider',
    },
    {
      type: 'section',
      accessory: {
        'type': 'image',
        'image_url': 'https://greative-assets.s3.amazonaws.com/octocats/octocat.gif',
        'alt_text': 'Octocat walks out',
      },
      text: {
        type: 'mrkdwn',
        text: `:red_circle: *Unit tests have failed*\n${'```'}\n${errors.join('\n```\n```\n')}\n${'```'}`,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: context,
        }
      ]
    }
  ]

  if (errors.length > 0) {
    console.log(JSON.stringify({
      type: 'mrkdwn',
      text: 'Unit tests failed',
      blocks,
    }, null, 2))
  }
}

read(process.argv[2], process.argv[3])
