const templates = [
  '{s} gave {r} an awkward hug.',
  '{s} pretended to give {r} a hug, but put a "Kick Me" sign on them.',
  '{s} gave {r} a great bear hug!',
  '{r}, {s} just gave you the best hug of your life!',
  '{s} gave {r} a friendly little hug.',
  '{s} tried to give {r} a hug but was denied.',
  '{s} tackle-hugs {r}.',
  '{s} gave {r} a bog standard hug',
  '{r} accidentally reported the wrong thing so {s} gave them a hug to stop {r} from crying',
  '{s} gives {r} a cereal soupy hug',
  '{s} hugged {r} so hard, they exploded in a cloud of pepperonis',
  '{s} goes to hug {r}, what a good friendship.',
  '{s} successfully hugs {r} with the power of the Wumpus.',
  '{s} sent {r} some love, do I get some too?',
  '{r} ducked when {s} tried to hug them.',
  '{s} hugged {r} but {r} took it as an attack!',
  '{s} fills {r} with sweet love',
  'As {s} ran all sweaty and tired reaching out for a last punch, {r} dashed to the side, leaving {s} tumbling onto the ground.'
]

const bothug = 'Aww, {s} thanks for hugging me!'

module.exports = {
  meta: {
    level: 1,
    noDM: true,
    alias: ['huh', 'hugh']
  },
  fn: async (msg, suffix) => {
    if (!/<@!?([0-9]*)>/.test(suffix)) return msg.channel.createMessage('Please mention someone!')
    let id = suffix.match(/<@!?([0-9]*)>/)[1]
    if (id === msg.author.id) return msg.channel.createMessage("Can't execute this action on yourself")
    if (id === bot.user.id) return msg.channel.createMessage(bothug.replace(/{s}/g, msg.author.username))
    const user = bot.users.get(id) || await bot.getRESTUser(id)
    const random = templates[Math.floor(Math.random() * templates.length)].replace(/{s}/g, msg.author.username).replace(/{r}/g, user.username)
    msg.channel.createMessage(random)
  }
}
