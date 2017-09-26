import { User } from '../models/user'

/*
 * Right now, these handlers are not used. They can be used in the future,
 * i.e. when 'superadmin' handles users, or when user wants to be deleted.
 */

// -----------------------------------------------------------------------------
// Get all the users [GET]
// -----------------------------------------------------------------------------
const getUsers = (request, reply) => {
  User.find({}, (error, users) => {
    if (error) {
      return reply(error).code(500)
    }

    return reply(users).code(200)
  })
}

// -----------------------------------------------------------------------------
// Get one user with the id [GET]
// -----------------------------------------------------------------------------
const getUser = (request, reply) => {
  User.find({
    email: request.params.id
  }, (error, user) => {
    if (error) return reply(error).code(500)

    return reply(user).code(200)
  })
}
// -----------------------------------------------------------------------------
// Delete a user [DELETE]
// -----------------------------------------------------------------------------
const deleteUser = (request, reply) => {
  User.remove({
    _id: request.params.id
  }, (error, user) => {
    if (error) return reply(error).code(500)

    return reply(user).code(200)
  })
}

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/users',
      config: {
        handler: getUsers,
        auth: 'session'
      }
    },
    {
      method: 'GET',
      path: '/api/user/{id}',
      config: {
        handler: getUser,
        auth: 'session'
      }
    },
    {
      method: 'DELETE',
      path: '/api/user/{id}',
      config: {
        handler: deleteUser,
        auth: 'session'
      }
    }
  ])

  next()
}

exports.register.attributes = {
  name: 'user'
}
