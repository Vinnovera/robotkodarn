import User from '../models/user'

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
// Register a new user [POST]
// -----------------------------------------------------------------------------
const addUser = (request, reply) => {
  User.findOne({
    email: request.payload.email
  }, (error, user) => {
    if (error) {
      return reply(error).code(500)
    }

    if (user) {
      return reply({ error: 'User already exists' }).code(400)
    }

    user = new User(request.payload)

    user.save((error) => {
      if (error) {
        return reply({ error: error.message }).code(400)
      }

      return reply(user).code(200)
    })
  })
}

// -----------------------------------------------------------------------------
// Update a user [PUT]
// -----------------------------------------------------------------------------
const updateUser = (request, reply) => {
  User.findOne({
    _id: request.params.id
  }, (error, foundUser) => {
    if (error) {
      return reply(error).code(500)
    }

    const i = Object.assign(foundUser, request.payload)

    i.save((error, doc) => {
      if (error) {
        return reply({ error: error.message }).code(400)
      }

      return reply(doc).code(200)
    })
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
      method: 'POST',
      path: '/api/user',
      config: {
        handler: addUser,
        auth: 'session'
      }
    },
    {
      method: 'PUT',
      path: '/api/user/{id}',
      config: {
        handler: updateUser,
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
