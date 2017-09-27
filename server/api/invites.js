import Joi from 'joi'
import { Invite, inviteValidation } from '../models/invite'

const addInvite = async (request, reply) => {
  try {
    const invite = await new Invite()

    // Validate invitation
    const validation = await Joi.validate(invite, inviteValidation)
    if (validation.error) {
      const error = new Error('Did not pass validation.')
      error.code = 400
      throw error
    }

    await invite.save()

    return reply(invite).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
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

