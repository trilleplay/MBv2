const required = [
  'BOT_TOKEN',
  'BOT_PREFIX',
  'ZENDESK_ROOT_URL',
  'ZENDESK_DEFAULT_ACTOR',
  'ZENDESK_API_KEY',
  'DISCORD_WEBHOOK_ID',
  'DISCORD_WEBHOOK_TOKEN'
]

for (let x of required) {
  if (!process.env[x]) {
    global.logger.error(`Missing environment variable ${x}, can't continue`, true)
  }
}
