import Joi from 'joi'
import { User, userValidation } from '../models/user'
import { Invite } from '../models/invite'

/**
 * Checks if invitationID exists in database. If true, creates a new user,
 * store the invitationID on user. Also store the userID in cookie
 */
const createUserFromInvitation = async (request, reply) => {
	const inviteID = request.params.id

	try {
		const existingInvitation = await Invite.findOne({ inviteID })

		if (existingInvitation) {
			const newUser = new User({ invitationID: inviteID })
			console.log('newUser', newUser)
			await newUser.save()
			request.cookieAuth.set({ _id: newUser._id })
			reply().redirect('/register')

			// Remove the invite since it is now stored on user
			await Invite.remove({ inviteID })
		} else {
			const incompleteUser = await User.findOne({ invitationID: inviteID, complete: false })

			if (incompleteUser) {
				request.cookieAuth.set({ _id: incompleteUser._id })
				reply().redirect('/register')
			} else {
				return reply.redirect('/admin')
			}
		}
	} catch (error) {
		return reply({ error: error.message }).code(error.code || 500)
	}
}

/**
 * Check if cookie exists. If user is not complete,
 * make registration form accessible.
 * If user exists and is complete, reply with 200.
 */
const checkRegistrationStatus = async (request, reply) => {
	const { _id } = request.auth.artifacts

	try {
		const user = await User.findOne({ _id })

		if (!user) {
			const error = new Error('User does not exist.')
			error.code = 401
			return reply({ error: error.message }).code(error.code)
		} else if (user && user.complete) {
			const error = new Error('User is already registered.')
			error.code = 403
			return reply({ error: error.message }).code(error.code)
		}
		reply().code(200)
	} catch (error) {
		return reply({ error: error.message }).code(500)
	}
}

/**
 * Takes the payload from registration form and updates user.
 * Also marks the user as complete.
 */
const completeRegistration = async (request, reply) => {
	const { _id } = request.auth.artifacts

	try {
		// Find user in database
		const currentUser = await User.findOne({ _id })

		// Take information from payload and assign it to the current user
		const updatedUser = Object.assign(currentUser, request.payload)

		const validatedUser = Joi.validate(updatedUser, userValidation, (validationError, value) => {
			if (validationError) {
				const error = new Error('Did not pass validation.')
				error.code = 400
				throw error
			}

			return value
		})

		// Mark user as complete and save to database
		validatedUser.complete = true
		await validatedUser.save()

		// Once replied is sent, user will automatically be redirected to /workshops
		return reply().code(200)
	} catch (error) {
		return reply({ error: error.message }).code(error.code || 500)
	}
}

exports.register = (server, options, next) => {
	server.route([
		{
			method: 'GET',
			path: '/register/{id}',
			config: {
				validate: {
					params: {
						id: Joi.string().required() // Make sure that id is a string
					}
				},
				handler: createUserFromInvitation
			}
		},
		{
			method: 'GET',
			path: '/api/register/user',
			config: {
				handler: checkRegistrationStatus,
				auth: 'session'
			}
		},
		{
			method: 'PUT',
			path: '/api/register/user',
			config: {
				handler: completeRegistration,
				auth: 'session'
			}
		}
	])
	next()
}

exports.register.attributes = {
	name: 'registration'
}

