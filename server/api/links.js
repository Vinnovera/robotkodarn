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
		/**
		 * First make sure that the content received is valid
		 */
		const validated = contentValidation.validate(request.payload, { abortEarly: false })
		if (validated.error) {
			throw validated.error
		}

		const workshop = await Workshop.findOne({ _id: request.params.id })
		const link = new Link(validated.value)

		// Return with 401 (Unauthorized) if we don't have permission
		if (!workshop.isAuthorizedToEdit(request.auth.credentials._id)) {
			return reply({ error: 'Du försökte en fuling?' }).code(401)
		}

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

		// Return with 401 (Unauthorized) if we don't have permission
		if (!workshop.isAuthorizedToEdit(request.auth.credentials._id)) {
			return reply({ error: 'Du försökte en fuling?' }).code(401)
		}

		// Find the link that is to be updated
		const linkToUpdate = workshop.links.filter((link) => {
			return link._id.toString() === request.params.lid
		})[0]
		const index = workshop.links.indexOf(linkToUpdate)

		// Update the fields with changes (can be title and/or content)
		const updatedLink = Object.assign(linkToUpdate, request.payload)

		/**
		 * First make sure that the content received is valid
		 */
		const validated = linkValidation.validate(updatedLink, { abortEarly: false })
		if (validated.error) {
			throw validated.error
		}

		// Replace the old link with the new
		workshop.links[index] = validated.value

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
		const workshop = await Workshop.findOne({ _id: request.params.wid })

		// Return with 401 (Unauthorized) if we don't have permission
		if (!workshop.isAuthorizedToEdit(request.auth.credentials._id)) {
			return reply({ error: 'Du försökte en fuling?' }).code(401)
		}

		/*
		 * Remove all links with the id of link to be deleted.
		 * Since link._id is an object, we first need to convert it to a string.
		 */
		const updatedLinkList = workshop.links.filter((link) => {
			return link._id.toString() !== request.params.lid
		})

		// Save updatedLinkList as list of links.
		workshop.links = updatedLinkList

		await workshop.save()

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

