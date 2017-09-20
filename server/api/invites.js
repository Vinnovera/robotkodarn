import Joi from 'joi'
import { Invite, inviteValidation } from '../models/invite'

const addInvite = (request, reply) => {
  const invite = new Invite(request.payload)

  Joi.validate(invite, inviteValidation, (validationError, /* value */) => {
    if (validationError) {
      return reply({ error: validationError }).code(400)
    }

    invite.save((error) => {
      if (error) {
        return reply({ error: error.message }).code(400)
      }

      return reply(invite).code(200)
    })
  })
}


exports.register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/api/invite',
      config: {
        handler: addInvite
      }
    }
  ])
  next()
}

exports.register.attributes = {
  name: 'invites'
}

