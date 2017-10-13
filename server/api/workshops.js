import Joi from 'joi'
import mongoose from 'mongoose'
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

const addWorkshop = async (request, reply) => {
  try {
    const user = request.auth.artifacts
    const workshop = new Workshop(request.payload)
    workshop.userId = user._id

    const validatedWorkshop = Joi.validate(workshop, workshopValidation).value
    await validatedWorkshop.save()

    return reply(validatedWorkshop).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
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
// Copy a workshop by existing workshop with ID [POST]
// -----------------------------------------------------------------------------
const copyWorkshop = async (request, reply) => {
  try {
    const existingWorkshop = await Workshop.findOne({ _id: request.params.id })

    const newWorkshop = new Workshop(existingWorkshop)
    newWorkshop.title = `${existingWorkshop.title} – kopia`
    newWorkshop._id = mongoose.Types.ObjectId()
    newWorkshop.isNew = true
    // Generate a new random pin
    newWorkshop.pincode = Math.floor(1000 + (Math.random() * 9000))

    await newWorkshop.save()

    return reply().code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
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
      method: 'POST',
      path: '/api/copyWorkshop/{id}',
      config: {
        handler: copyWorkshop,
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
