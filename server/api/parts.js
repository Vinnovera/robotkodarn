import Joi from 'joi'
import { Part, partValidation } from '../models/part'
import { Workshop } from '../models/workshop'

// -----------------------------------------------------------------------------
// Get all part [GET]
// -----------------------------------------------------------------------------
const getParts = (request, reply) => {
  Workshop.findOne({ _id: request.params.id }, (error, foundWorkshop) => {
    if (error) {
      return reply(error).code(500)
    }

    return reply(foundWorkshop.parts).code(200)
  })
}

// -----------------------------------------------------------------------------
// Get one part with {id} [GET]
// -----------------------------------------------------------------------------
const getPart = (request, reply) => {
  Workshop.findOne({ _id: request.params.wid }, (error, foundWorkshop) => {
    if (error) {
      return reply(error).code(500)
    }

    const part = foundWorkshop.parts.filter(item => item._id === request.params.pid)[0]

    return reply(part).code(200)
  })
}

// -----------------------------------------------------------------------------
// Add a part [POST]
// -----------------------------------------------------------------------------
const addPart = (request, reply) => {
  Workshop.findOne({ _id: request.params.id }, (error, foundWorkshop) => {
    if (error) {
      return reply(error).code(500)
    }

    const part = new Part(request.payload)

    // 'value' exists but is not in use, hence: commented out.
    Joi.validate(part, partValidation, (validationError, /* value */) => {
      if (validationError) {
        return reply({ error: validationError }).code(400)
      }

      foundWorkshop.parts.push(part)

      foundWorkshop.save((saveError) => {
        if (saveError) {
          return reply({ error: saveError.message }).code(400)
        }

        return reply(foundWorkshop).code(200)
      })
    })
  })
}

// -----------------------------------------------------------------------------
// Update a part with {id} [PUT]
// -----------------------------------------------------------------------------
const updatePart = (request, reply) => {
  Workshop.findOne({ _id: request.params.wid }, (error, foundWorkshop) => {
    if (error) {
      return reply(error).code(500)
    }

    const partToUpdate = foundWorkshop.parts.filter(part => part._id === request.params.pid)[0]
    const index = foundWorkshop.parts.indexOf(partToUpdate)
    const newPart = Object.assign(partToUpdate, request.payload)

    Joi.validate(newPart, partValidation, (validationError, /* value */) => {
      if (validationError) {
        return reply({ error: validationError }).code(400)
      }

      foundWorkshop.parts.splice(index, 1, newPart)

      foundWorkshop.save((saveError) => {
        if (saveError) {
          return reply({ error: saveError.message }).code(400)
        }

        return reply(foundWorkshop).code(200)
      })
    })
  })
}

// -----------------------------------------------------------------------------
// Delete a part with {id} [DELETE]
// -----------------------------------------------------------------------------
const deletePart = async (request, reply) => {
  try {
    const currentWorkshop = await Workshop.findOne({ _id: request.params.wid })

    /*
     * Remove all parts with the id that we want to delete.
     * Since part._id is an object, we first need to convert it to a string.
     */
    const updatedPartsList = currentWorkshop.parts.filter((part) => {
      return part._id.toString() !== request.params.pid
    })

    // Save updatedPartsList as list of parts.
    currentWorkshop.parts = updatedPartsList

    await currentWorkshop.save()

    return reply(currentWorkshop).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/workshop/{id}/parts',
      config: {
        handler: getParts
      }
    },
    {
      method: 'GET',
      path: '/api/workshop/{wid}/part/{pid}',
      config: {
        handler: getPart
      }
    },
    {
      method: 'POST',
      path: '/api/workshop/{id}/part',
      config: {
        handler: addPart,
        auth: 'session'
      }
    },
    {
      method: 'PUT',
      path: '/api/workshop/{wid}/part/{pid}',
      config: {
        handler: updatePart,
        auth: 'session'
      }
    },
    {
      method: 'DELETE',
      path: '/api/workshop/{wid}/part/{pid}',
      config: {
        handler: deletePart,
        auth: 'session'
      }
    }
  ])

  next()
}

exports.register.attributes = {
  name: 'parts'
}
