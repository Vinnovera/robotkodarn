import { User, starredWorkshopValidation } from '../models/user'
/*
 * Right now, these handlers are not used. They can be used in the future,
 * i.e. when 'superadmin' handles users, or when user wants to be deleted.
 */

// -----------------------------------------------------------------------------
// Get all the users [GET]
// -----------------------------------------------------------------------------
const getUsers = (request, reply) => {
	User.find({}, (error, users) => {
		if (error) {
			return reply(error).code(500)
		}

		return reply(users).code(200)
	}).populate('starredWorkshops', {
		_id: 1,
		pincode: 1,
		title: 1,
		author: 1
	})
}

// -----------------------------------------------------------------------------
// Get user by id [GET]
// -----------------------------------------------------------------------------
const getUserById = (request, reply) => {
	const { _id } = request.auth.credentials

	User.findOne({
		_id: _id
	}, (error, user) => {
		if (error) return reply(error).code(500)

		return reply({
			email: user.email,
			role: user.role,
			name: user.name,
			starredWorkshops: user.starredWorkshops
		}).code(200)
	}).populate({
		path: 'starredWorkshops',
		select: {
			_id: 1,
			pincode: 1,
			title: 1,
			author: 1
		},
		populate: {
			path: 'author',
			select: {
				_id: 1,
				name: 1
			}
		}
	})
}

// -----------------------------------------------------------------------------
// Get one user with the email [GET]
// -----------------------------------------------------------------------------
const getUserByEmail = (request, reply) => {
	User.find({
		email: request.params.email
	}, (error, user) => {
		if (error) return reply(error).code(500)

		return reply(user).code(200)
	}).populate('starredWorkshops', {
		_id: 1,
		pincode: 1,
		title: 1,
		author: 1
	})
}

// -----------------------------------------------------------------------------
// Register a new user [POST]
// -----------------------------------------------------------------------------
const addUser = (request, reply) => {
	User.findOne({
		email: request.payload.email
	}, (error, user) => {
		if (error) {
			return reply(error).code(500)
		}

		if (user) {
			return reply({ error: 'User already exists' }).code(400)
		}

		let newUser = user
		newUser = new User(request.payload)

		newUser.save((userError) => {
			if (userError) {
				return reply({ userError: error.message }).code(400)
			}

			return reply(newUser).code(200)
		})
	})
}

// -----------------------------------------------------------------------------
// Star a workshop in a user [POST]
// -----------------------------------------------------------------------------
const starWorkshop = async (request, reply) => {
	// Get the userId from session
	const userId = request.auth.credentials._id

	try {
		// This will cast a 500 error if no workshop is found.
		const user = await User.findOne({ _id: userId })

		// First make sure that the content received is valid
		const validatedWorkshopId = starredWorkshopValidation.validate(request.payload.workshopId, { abortEarly: false })
		if (validatedWorkshopId.error) {
			throw validatedWorkshopId.error
		}

		const newStarredWorkshops = [...user.starredWorkshops]

		// Check if we already have the workshopId in the starredWorkshops array
		// 409 = https://stackoverflow.com/questions/3825990/http-response-code-for-post-when-resource-already-exists
		if (newStarredWorkshops.indexOf(validatedWorkshopId.value) !== -1) {
			return reply({ error: 'Workshopen är redan stjärnmärkt' }).code(409)
		}

		// Push the workshopID to the array
		newStarredWorkshops.push(validatedWorkshopId.value)

		// Update and save to database
		await User.update({ _id: user._id }, { starredWorkshops: newStarredWorkshops })
		return reply(newStarredWorkshops).code(200)
	} catch (error) {
		return reply({ error: error.message }).code(error.code || 500)
	}
}

// -----------------------------------------------------------------------------
// Unstar a workshop in a user [DELETE]
// -----------------------------------------------------------------------------
const unstarWorkshop = async (request, reply) => {
	// Get the userId from session
	const userId = request.auth.credentials._id

	try {
		// This will cast a 500 error if no workshop is found.
		const user = await User.findOne({ _id: userId })

		// First make sure that the content received is valid
		const validatedWorkshopId = starredWorkshopValidation.validate(request.params.wid, { abortEarly: false })
		if (validatedWorkshopId.error) {
			throw validatedWorkshopId.error
		}

		const newStarredWorkshops = [...user.starredWorkshops]
		const indexToBeSpliced = newStarredWorkshops.indexOf(validatedWorkshopId.value)

		newStarredWorkshops.splice(indexToBeSpliced, 1)

		await User.update({ _id: user._id }, { starredWorkshops: newStarredWorkshops })
		return reply(newStarredWorkshops).code(200)
	} catch (error) {
		return reply({ error: error.message }).code(error.code || 500)
	}
}

// -----------------------------------------------------------------------------
// Update a user [PUT]
// -----------------------------------------------------------------------------
// TODO: This isn't beeing used? Does it even work?
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
			path: '/api/user/{email}',
			config: {
				handler: getUserByEmail
			}
		},
		{
			method: 'GET',
			path: '/api/user',
			config: {
				handler: getUserById,
				auth: 'session'
			}
		},
		{
			method: 'POST',
			path: '/api/user',
			config: {
				handler: addUser,
				auth: 'session'
			}
		},
		{
			method: 'POST',
			path: '/api/user/star',
			config: {
				handler: starWorkshop,
				auth: 'session'
			}
		},
		{
			method: 'DELETE',
			path: '/api/user/star/{wid}',
			config: {
				handler: unstarWorkshop,
				auth: 'session'
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
