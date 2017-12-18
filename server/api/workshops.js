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
    workshop.pincode = Math.floor(1000 + (Math.random() * 9000))

    /**
     * First make sure that the content received is valid
    */
    const validated = workshopValidation.validate(workshop, { abortEarly: false })
    if (validated.error) {
      throw validated.error
    }

    await validated.value.save()

    return reply(validated.value).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}

// -----------------------------------------------------------------------------
// Update a workshop parts with {id} [PUT]
// -----------------------------------------------------------------------------
const updateWorkshopParts = async (request, reply) => {
  try {
    const workshop = await Workshop.findOne({ _id: request.params.id })
    const sortedParts = []

    workshop.parts.forEach((part) => {
      const index = request.payload.indexOf(part._id.toString())
      sortedParts[index] = part
    })

    const updatedWorkshop = Object.assign(workshop, { parts: sortedParts })

    const validated = workshopValidation.validate(updatedWorkshop, { abortEarly: false })
    if (validated.error) {
      throw validated.error
    }

    await validated.value.save()

    return reply(validated.value).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}

// -----------------------------------------------------------------------------
// Update a workshop links with {id} [PUT]
// -----------------------------------------------------------------------------
const updateWorkshopLinks = async (request, reply) => {
  try {
    const workshop = await Workshop.findOne({ _id: request.params.id })
    const sortedLinks = []

    workshop.links.forEach((link) => {
      const index = request.payload.indexOf(link._id.toString())
      sortedLinks[index] = link
    })

    const updatedWorkshop = Object.assign(workshop, { links: sortedLinks })

    const validated = workshopValidation.validate(updatedWorkshop, { abortEarly: false })
    if (validated.error) {
      throw validated.error
    }

    await validated.value.save()

    return reply(validated.value).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}

// -----------------------------------------------------------------------------
// Copy a workshop by existing workshop with ID [POST]
// -----------------------------------------------------------------------------
const copyWorkshop = async (request, reply) => {
  try {
    const existingWorkshop = await Workshop.findOne({ _id: request.params.id })

    const copy = Object.assign(existingWorkshop, {
      title: `${existingWorkshop.title} – kopia`,
      _id: mongoose.Types.ObjectId(),
      isNew: true,
      pincode: Math.floor(1000 + (Math.random() * 9000))
    })

    await copy.save()

    return reply(copy).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}

// -----------------------------------------------------------------------------
// Delete a workshop with {id} [DELETE]
// -----------------------------------------------------------------------------
const deleteWorkshop = async (request, reply) => {
  try {
    const workshop = request.params
    await Workshop.remove({ _id: workshop.id })

    return reply(workshop).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
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
      path: '/api/workshop/{id}/parts',
      config: {
        handler: updateWorkshopParts,
        auth: 'session'
      }
    },
    {
      method: 'PUT',
      path: '/api/workshop/{id}/links',
      config: {
        handler: updateWorkshopLinks,
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
