import { User } from '../models/user'

/**
 * Checks that cookie and user exists,
 * and that user is complete.
 */
const isLoggedIn = async (request, reply) => {
  const { _id } = request.auth.credentials
  try {
    const existingUser = await User.findOne({ _id })
    if (existingUser.complete) {
      reply(existingUser.role).code(200)
    } else {
      const error = new Error('Registration not completed')
      error.code = 401
      throw error
    }
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/isLoggedIn',
      config: {
        handler: isLoggedIn,
        auth: 'session'
      }
    }
  ])

  next()
}

exports.register.attributes = {
  name: 'administrators'
}
