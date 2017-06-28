import { Link, linkValidation } from '../models/link'
import { Workshop } from '../models/workshop'
import Joi from 'joi'


// ----------------------------------------
// Get all links [GET]
// ----------------------------------------
const getLinks = (request, reply) => {
	Workshop.findOne({_id: request.params.id}, (error, foundWorkshop) => {
		if (error) return reply(error).code(500)

			return reply(foundWorkshop.links).code(200)
	})
}

// ----------------------------------------
// Get one link with {id} [GET]
// ----------------------------------------
const getLink = (request, reply) => {
	Workshop.findOne({_id: request.params.wid}, (error, foundWorkshop) => {
		if (error) return reply(error).code(500)

			const link = foundWorkshop.links.filter( (link) => link._id == request.params.lid )[0]

		return reply(link).code(200)
	})
}

// ----------------------------------------
// Add a link [POST]
// ----------------------------------------
const addLink = (request, reply) => {
	Workshop.findOne({_id: request.params.id}, (error, foundWorkshop) => {
		if (error) return reply(error).code(500)
			
			const link = new Link(request.payload)

		Joi.validate(link, linkValidation, (validationError, value) => {
			if (validationError) return reply({error: validationError}).code(400)

				foundWorkshop.links.push(link)

			foundWorkshop.save(saveError => {
				if (saveError) return reply({error: saveError.message}).code(400)
					return reply(foundWorkshop).code(200)			
			})
		})
	})
}

// ----------------------------------------
// Update a link with {id} [PUT]
// ----------------------------------------
const updateLink = (request, reply) => {
	Workshop.findOne({_id: request.params.wid}, (error, foundWorkshop) => {
		if (error) return reply(error).code(500)

			const linkToUpdate = foundWorkshop.links.filter( (link) => link._id == request.params.lid)[0]
		const index = foundWorkshop.links.indexOf(linkToUpdate)
		
		const newLink = Object.assign(linkToUpdate, request.payload)

		Joi.validate(newLink, linkValidation, (validationError, value) => {
			if (validationError) return reply({error: validationError}).code(400)

				foundWorkshop.links.splice( index, 1, newLink )

			foundWorkshop.save(saveError => {
				if (saveError) return reply({error: saveError.message}).code(400)

					return reply(foundWorkshop).code(200)
			})
		})
	})
}

// ----------------------------------------
// Delete a link with {id} [DELETE]
// ----------------------------------------
const deleteLink = (request, reply) => {
	Workshop.findOne({_id: request.params.wid}, (error, foundWorkshop) => {
		if (error) return reply(error).code(500)

			const linkToDelete = foundWorkshop.links.filter( (link) => link._id == request.params.lid )[0]
		foundWorkshop.links.splice( foundWorkshop.links.indexOf(linkToDelete), 1 )

		foundWorkshop.save(error => {
			if (error) return reply({error: error.message}).code(400)

				return reply(foundWorkshop).code(200)
		})
	})
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

