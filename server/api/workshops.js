import Joi from 'joi'
import { Workshop, workshopValidation } from '../models/workshop'

// -----------------------------------------------------------------------------
// Get all workshops [GET]
// -----------------------------------------------------------------------------
const getWorkshops = (request, reply) => {
  Workshop.find({}, (error, workshops) => {
    if (error) {
      return reply(error).code(500)
    }

    return reply(workshops).code(200)
  })
}

// -----------------------------------------------------------------------------
// Get one workshop with {id} [GET]
// -----------------------------------------------------------------------------
const getWorkshop = (request, reply) => {
  Workshop.findOne({
    _id: request.params.id
  }, (error, workshops) => {
    if (error) {
      return reply(error).code(500)
    }

    return reply(workshops).code(200)
  })
}

// -----------------------------------------------------------------------------
// Get one workshop with {id} [GET]
// -----------------------------------------------------------------------------
const getWorkshopsByUserId = (request, reply) => {
  const name = request.auth.artifacts

  Workshop.find({
    userId: name._id
  }, (error, workshops) => {
    if (error) {
      return reply(error).code(500)
    }

    return reply(workshops).code(200)
  })
}

// -----------------------------------------------------------------------------
// Add a workshop [POST]
// -----------------------------------------------------------------------------
const addWorkshop = (request, reply) => {
  const name = request.auth.artifacts
  const workshop = new Workshop(request.payload)
  workshop.userId = name._id

  Joi.validate(workshop, workshopValidation, (validationError, value) => {
    if (validationError) {
      return reply({ error: validationError }).code(400)
    }

    workshop.save((error) => {
      if (error) {
        return reply({ error: error.message }).code(400)
      }

      return reply(workshop).code(200)
    })
  })
}

// -----------------------------------------------------------------------------
// Update a workshop with {id} [PUT]
// -----------------------------------------------------------------------------
const updateWorkshop = (request, reply) => {
  Workshop.findOne({
    _id: request.params.id
  }, (error, foundWorkshop) => {
    if (error) {
      return reply(error).code(500)
    }

    const workshop = Object.assign(foundWorkshop, request.payload)

    Joi.validate(workshop, workshopValidation, (validationError, value) => {
      if (validationError) {
        return reply({ error: validationError }).code(400)
      }

      workshop.save((error, doc) => {
        if (error) {
          return reply({ error: error.message }).code(400)
        }

        return reply(doc).code(200)
      })
    })
  })
}

// -----------------------------------------------------------------------------
// Delete a workshop with {id} [DELETE]
// -----------------------------------------------------------------------------
const deleteWorkshop = (request, reply) => {
  Workshop.remove({
    _id: request.params.id
  }, (error, workshop) => {
    if (error) {
      return reply(error).code(500)
    }

    return reply(workshop).code(200)
  })
}

// -----------------------------------------------------------------------------
// Get one workshop with {id} [GET]
// -----------------------------------------------------------------------------
const getWorkshopByPin = (request, reply) => {
  Workshop.findOne({
    pincode: request.params.pin
  }, (error, foundWorkshop) => {
    if (error) {
      return reply(error).code(500)
    }

    if (!foundWorkshop) {
      return reply(error).code(400)
    }

    return reply(foundWorkshop).code(200)
  })
}

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/workshops',
      config: {
        handler: getWorkshops,
        auth: 'session'
      }
    },
    {
      method: 'GET',
      path: '/api/workshopsbyuser',
      config: {
        handler: getWorkshopsByUserId,
        auth: 'session'
      }
    },
    {
      method: 'GET',
      path: '/api/workshop/{id}',
      config: {
        handler: getWorkshop
      }
    },
    {
      method: 'POST',
      path: '/api/workshop',
      config: {
        handler: addWorkshop,
        auth: 'session'
      }
    },
    {
      method: 'PUT',
      path: '/api/workshop/{id}',
      config: {
        handler: updateWorkshop,
        auth: 'session'
      }
    },
    {
      method: 'DELETE',
      path: '/api/workshop/{id}',
      config: {
        handler: deleteWorkshop,
        auth: 'session'
      }
    },
    {
      method: 'GET',
      path: '/api/workshop/pin/{pin}',
      config: {
        handler: getWorkshopByPin
      }
    }
  ])

  next()
}

exports.register.attributes = {
  name: 'workshops'
}
