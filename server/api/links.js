import Joi from 'joi'
import { Link, linkValidation, contentValidation } from '../models/link'
import { Workshop } from '../models/workshop'

// -----------------------------------------------------------------------------
// Get all links [GET]
// -----------------------------------------------------------------------------
const getLinks = (request, reply) => {
  Workshop.findOne({ _id: request.params.id }, (error, foundWorkshop) => {
    if (error) {
      return reply(error).code(500)
    }

    return reply(foundWorkshop.links).code(200)
  })
}

// -----------------------------------------------------------------------------
// Get one link with {id} [GET]
// -----------------------------------------------------------------------------
const getLink = (request, reply) => {
  Workshop.findOne({ _id: request.params.wid }, (error, foundWorkshop) => {
    if (error) {
      return reply(error).code(500)
    }

    const link = foundWorkshop.links.filter(item => item._id === request.params.lid)[0]

    return reply(link).code(200)
  })
}

// -----------------------------------------------------------------------------
// Add a link [POST]
// -----------------------------------------------------------------------------
const addLink = async (request, reply) => {
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

    const workshop = await Workshop.findOne({ _id: request.params.id })
    const link = new Link(validatedContent)

    workshop.links.push(link)
    await workshop.save()

    return reply(link).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}

// -----------------------------------------------------------------------------
// Update a link with {id} [PUT]
// -----------------------------------------------------------------------------
const updateLink = async (request, reply) => {
  try {
    // This will cast a 500 error if no workshop is found.
    const workshop = await Workshop.findOne({ _id: request.params.wid })

    // Find the link that is to be updated
    const linkToUpdate = workshop.links.filter((link) => {
      return link._id.toString() === request.params.lid
    })[0]
    const index = workshop.links.indexOf(linkToUpdate)

    // Update the fields with changes (can be title and/or content)
    const updatedLink = Object.assign(linkToUpdate, request.payload)

    /* Validate the updated link
     * This can't be done until we have the id as well as full content.
     */
    let validatedLink

    Joi.validate(updatedLink, linkValidation, (validationError, value) => {
      if (validationError) {
        const error = validationError
        error.code = 400
        throw error
      }
      validatedLink = value
    })

    // Replace the old link with the new
    workshop.links[index] = validatedLink

    // Update and save to database
    await Workshop.update({ _id: workshop._id }, { links: workshop.links })

    return reply(workshop.links).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}

// -----------------------------------------------------------------------------
// Delete a link with {id} [DELETE]
// -----------------------------------------------------------------------------
const deleteLink = async (request, reply) => {
  try {
    const currentWorkshop = await Workshop.findOne({ _id: request.params.wid })

    /*
     * Remove all links with the id of link to be deleted.
     * Since link._id is an object, we first need to convert it to a string.
     */
    const updatedLinkList = currentWorkshop.links.filter((link) => {
      return link._id.toString() !== request.params.lid
    })

    // Save updatedLinkList as list of links.
    currentWorkshop.links = updatedLinkList

    await currentWorkshop.save()

    return reply(updatedLinkList).code(200)
  } catch (error) {
    return reply({ error: error.message }).code(error.code || 500)
  }
}

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/workshop/{id}/links',
      config: {
        handler: getLinks
      }
    },
    {
      method: 'GET',
      path: '/api/workshop/{wid}/link/{lid}',
      config: {
        handler: getLink
      }
    },
    {
      method: 'POST',
      path: '/api/workshop/{id}/link',
      config: {
        handler: addLink,
        auth: 'session'
      }
    },
    {
      method: 'PUT',
      path: '/api/workshop/{wid}/link/{lid}',
      config: {
        handler: updateLink,
        auth: 'session'
      }
    },
    {
      method: 'DELETE',
      path: '/api/workshop/{wid}/link/{lid}',
      config: {
        handler: deleteLink,
        auth: 'session'
      }
    }
  ])

  next()
}

exports.register.attributes = {
  name: 'links'
}

