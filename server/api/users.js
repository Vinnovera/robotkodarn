import Joi from 'joi'
import { User, userValidation } from '../models/user'

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
  // First, check if user with the same email address already exists
  User.findOne({
    email: request.payload.email
  }, (error, existingUser) => {
    if (error) {
      return reply(error).code(500)
    }

    if (existingUser) {
      return reply({ error: 'User already exists' }).code(400)
    }

    // If no user with that email address exists, create a new user
    const user = new User(request.payload)

    Joi.validate(user, userValidation, (validationError, /* value */) => {
      if (validationError) {
        return reply({ error: validationError }).code(400)
      }

      user.save((saveError) => {
        if (saveError) {
          return reply({ error: saveError }).code(400)
        }

        return reply(user).code(200)
      })
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

    i.save((updateError, doc) => {
      if (updateError) {
        return reply({ updateError: error.message }).code(400)
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
        handler: addUser
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
