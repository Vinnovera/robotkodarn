import Joi from 'joi'
import { Part, partValidation, contentValidation } from '../models/part'
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
const createPart = async (request, reply) => {
  try {
    let validatedContent

    /**
     * First make sure that the content received is valid
     */
    Joi.validate(request.payload, contentValidation, (validationError, value) => {
      if (validationError) {
        const error = validationError
        error.code = 400
        throw error
      }
      validatedContent = value
    })

    // If no workshop found, this will throw a 500 error
    const workshop = await Workshop.findOne({ _id: request.params.id })

    const part = new Part(validatedContent)
    workshop.parts.push(part)

    await workshop.save()

    return reply(part).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}

// -----------------------------------------------------------------------------
// Update a part with {id} [PUT]
// -----------------------------------------------------------------------------
const updatePart = async (request, reply) => {
  try {
    // This will cast a 500 error if no workshop is found.
    const workshop = await Workshop.findOne({ _id: request.params.wid })

    // Find the part that is to be updated
    const partToUpdate = workshop.parts.filter((part) => {
      return part._id.toString() === request.params.pid
    })[0]

    // Update the fields with changes (can be title and/or content)
    const updatedPart = Object.assign(partToUpdate, request.payload)
    const index = workshop.parts.indexOf(partToUpdate)

    /* Validate the updated part.
     * This can't be done until we have the id as well as full content.
     */
    let validatedPart

    Joi.validate(updatedPart, partValidation, (validationError, value) => {
      if (validationError) {
        const error = validationError
        error.code = 400
        throw error
      }
      validatedPart = value
    })

    // Replace the old part with the new
    workshop.parts[index] = validatedPart

    // Update and save to database
    await Workshop.update({ _id: workshop._id }, { parts: workshop.parts })

    return reply(workshop.parts).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
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

    return reply(updatedPartsList).code(200)
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
        handler: createPart,
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
