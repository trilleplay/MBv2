const db = require('../databases/lokijs')

module.exports = {
  meta: {
    level: 2,
    alias: ['lookup'] // legacy
  },
  fn: async (msg, suffix) => {
    const chunks = suffix.split(' ')
    const userinfo = await db.get('users', chunks[0])
    if (!userinfo) return msg.channel.createMessage('This user is unknown to me')
    const userdata = bot.users.get(chunks[0]) || await global.bot.getRESTUser(chunks[0])
    if (!chunks[1]) {
      msg.channel.createMessage(generateInformationalEmbed(userdata, userinfo))
    } else {
      switch (chunks[1]) {
        case 'entitlements': {
          if (userinfo.entitlements.includes(chunks[2])) {
            userinfo.entitlements.splice(userinfo.entitlements.indexOf(chunks[2]), 1)
            db.edit(chunks[0], userinfo)
            msg.channel.createMessage('Removed entitlement')
          } else {
            userinfo.entitlements.push(chunks[2])
            db.edit(chunks[0], userinfo)
            msg.channel.createMessage('Granted entitlement')
          }
          break
        }
        case 'overrides': {
          if (userinfo.overrides.includes(chunks[2])) {
            userinfo.overrides.splice(userinfo.overrides.indexOf(chunks[2]), 1)
            db.edit(chunks[0], userinfo)
            msg.channel.createMessage('Removed override')
          } else {
            userinfo.overrides.push(chunks[2])
            db.edit(chunks[0], userinfo)
            msg.channel.createMessage('Granted override')
          }
          break
        }
        case 'exp':
        case 'xp': {
          const xp = require('../features/exp')
          if (isNaN(parseInt(chunks[2]))) return msg.channel.createMessage('3rd argument must be a number')
          const reason = chunks.slice(3).join(' ')
          if (reason.length < 1) return msg.channel.createMessage('Please provide a reason')
          xp.applyEXP(chunks[0], parseInt(chunks[2]), reason)
          return msg.channel.createMessage(`EXP modification applied, this user now has ${userinfo.properties.exp + parseInt(chunks[2])} EXP`)
        }
        case 'blocked':
        case 'block': {
          await db.edit(chunks[0], {
            blocked: !userinfo.blocked
          })
          msg.channel.createMessage(`This user is now ${userinfo.blocked ? 'un' : ''}blocked`)
        }
      }
    }
  }
}

function generateInformationalEmbed (userdata, userinfo) {
  const pending = db.findManySync('holds', {
    users: {
      $contains: userdata.id
    }
  })
  return {
    embed: {
      title: `MegaBot lookup on ${userdata.username}#${userdata.discriminator}`,
      timestamp: new Date(),
      color: 0x7289DA, // blurple
      footer: {
        icon_url: global.bot.user.dynamicAvatarURL('png', 32),
        text: `MegaBot ${process.env.NODE_ENV === 'debug' ? 'Development version' : 'v' + require('../../package').version}`
      },
      thumbnail: {
        url: `https://cdn.discordapp.com/avatars/${userdata.id}/${userdata.avatar}.png`
      },
      fields: [
        {
          name: 'Entitlements',
          value: (userinfo.entitlements.length > 0) ? userinfo.entitlements.join(', ') : 'None',
          inline: true
        },
        {
          name: 'Overrides',
          value: (userinfo.overrides.length > 0) ? userinfo.overrides.join(', ') : 'None',
          inline: true
        },
        {
          name: 'Blocked?',
          value: userinfo.blocked ? 'Yes' : 'No',
          inline: true
        },
        {
          name: 'EXP',
          value: userinfo.properties.exp,
          inline: true
        },
        {
          name: 'Pending transactions',
          value: pending.length,
          inline: true
        },
        {
          name: 'Pending EXP',
          value: pending.map(x => x.gain).reduce((a, b) => a + b, 0),
          inline: true
        },
        {
          name: 'Recently processed transactions',
          value: (userinfo.transactions.length > 0) ? userinfo.transactions.slice(Math.max(userinfo.transactions.length - 5, 0)).map(transactionTranslator).join('\n') : 'None'
        }
      ]
    }
  }
}

function transactionTranslator (tx) {
  return `Applied ${tx.modified}: \`${tx.reason}\``
}
