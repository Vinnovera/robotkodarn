import Joi from 'joi'
import { User, userValidation } from '../models/user'
import { Invite } from '../models/invite'

/**
 * Checks if invitationID exists in database. If true, creates a new user,
 * store the invitationID on user. Also store the userID in cookie
 */
const createUserFromInvitation = async (request, reply) => {
  const inviteID = request.params.id

  try {
    const existingInvitation = await Invite.findOne({ inviteID })

    let user
    if (existingInvitation) {
      // FIXME: Error when email is null (duplicate entries) needs to be fixed.
      user = new User({ invitationID: inviteID, email: inviteID })

      await user.save()

      // Remove invitationID from list
      await Invite.remove({ inviteID })
    } else {
      user = await User.findOne({ invitationID: inviteID, complete: false })

      if (!user) {
        return reply.redirect('/admin')
      }
    }

    request.cookieAuth.set({ _id: user._id })

    reply().redirect('/register')
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}

/**
 * Check if cookie exists. If user is not complete,
 * make registration form accessible.
 * If user exists and is complete, reply with 200.
 */
const checkRegistrationStatus = async (request, reply) => {
  const { _id } = request.auth.artifacts

  try {
    const user = await User.findOne({ _id })

    if (!user) {
      const error = new Error('User does not exist.')
      error.code = 401
      throw error
    } else if (user.complete) {
      const error = new Error('User is already registered.')
      error.code = 403
      throw error
    }
    reply().code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}

/**
 * Takes the payload from registration form and updates user.
 * Also sets user.complete = true.
 */
const completeRegistration = async (request, reply) => {
  const { _id } = request.auth.artifacts

  try {
    const currentUser = await User.findOne({ _id })
    const user = Object.assign(currentUser, request.payload)

    // Validate user
    const validation = await Joi.validate(user, userValidation)
    if (validation.error) {
      const error = new Error('Did not pass validation.')
      error.code = 400
      throw error
    }

    // Mark user as complete and save to database
    user.complete = true
    await user.save()

    /* Once user is saved, remove cookie. This will redirect user to '/admin',
     * where they can log in.
     */
    request.cookieAuth.clear()

    return reply().code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}


exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/register/{id}',
      config: {
        handler: createUserFromInvitation
      }
    },
    {
      method: 'GET',
      path: '/api/register/user',
      config: {
        handler: checkRegistrationStatus,
        auth: 'session'
      }
    },
    {
      method: 'PUT',
      path: '/api/register/user',
      config: {
        handler: completeRegistration,
        auth: 'session'
      }
    }
  ])
  next()
}

exports.register.attributes = {
  name: 'registration'
}

