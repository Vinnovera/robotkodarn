import config from 'config'
import CookieAuth from 'hapi-auth-cookie'
import { User } from '../models/user'

// -----------------------------------------------------------------------------
// Get one user using email [POST]
// -----------------------------------------------------------------------------
const signIn = (request, reply) => {
  if (!request.payload.email || !request.payload.password) {
    return reply({ message: 'Missing email or password' }).code(401)
  }

  User.findOne({ email: request.payload.email }, (error, user) => {
    if (error) return reply(error).code(500)

    // Email found, check if password is correct
    if (user) {
      const { _id } = user

      request.cookieAuth.set({ _id })

      if (user.password === request.payload.password) {
        reply({ message: 'Logged in' }).code(200)
      } else {
        reply({ message: 'Wrong username and/or password' }).code(401)
      }
    } else {
      // Email doesn't exist in db
      reply({ message: 'Wrong username and/or password' }).code(401)
    }
  })
}

// -----------------------------------------------------------------------------
// Check if user is complete and authorized. [GET]
// Replies with user role (superadmin/editor)
// -----------------------------------------------------------------------------
const checkAuthorization = async (request, reply) => {
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

// -----------------------------------------------------------------------------
// Clear cookie when logging out
// -----------------------------------------------------------------------------
const logout = (request, reply) => {
  request.cookieAuth.clear()
  reply({ message: 'auth/logout' })
}

exports.register = (server, options, next) => {
  server.register(CookieAuth, (error) => {
    if (error) throw error

    server.auth.strategy('session', 'cookie', {
      password: config.get('auth.key'),
      isSecure: process.env.NODE_ENV === 'production',
      cookie: 'robotkodarn',
      isHttpOnly: true
    })

    server.route([
      {
        method: 'POST',
        path: '/auth/signIn',
        config: {
          handler: signIn,
          auth: {
            mode: 'try',
            strategy: 'session'
          },
          plugins: {
            'hapi-auth-cookie': {
              redirectTo: false
            }
          }
        }
      },
      {
        method: 'GET',
        path: '/auth/checkAuthorization',
        config: {
          handler: checkAuthorization,
          auth: 'session'
        }
      },
      {
        method: 'GET',
        path: '/auth/logout',
        config: {
          handler: logout,
          auth: 'session'
        }
      }])

    next()
  })
}

exports.register.attributes = {
  name: 'auth'
}
