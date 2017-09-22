import { Invite } from '../models/invite'

const getRegistrationFormByID = (request, reply) => {
  Invite.findOne({ inviteID: request.params.id }, (error, existingInvitation) => {
    if (error) {
      return reply(error).code(500)
    }

    // If invitationID exists, let user be redirected to register
    if (existingInvitation) {
      return reply(existingInvitation).redirect('/register')
    }

    // If no invitationId, redirect to login
    return reply.redirect('/login')
  })
}

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/register/{id}',
      config: {
        handler: getRegistrationFormByID
      }
    }
  ])
  next()
}

exports.register.attributes = {
  name: 'registration'
}

