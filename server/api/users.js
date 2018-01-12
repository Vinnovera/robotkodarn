import { User } from '../models/user'

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
	})
}

// -----------------------------------------------------------------------------
// Get one user with the id [GET]
// -----------------------------------------------------------------------------
const getUser = (request, reply) => {
	User.find({
		email: request.params.id
	}, (error, user) => {
		if (error) return reply(error).code(500)

		return reply(user).code(200)
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
// Update a user [PUT]
// -----------------------------------------------------------------------------
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
			path: '/api/user/{id}',
			config: {
				handler: getUser,
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
