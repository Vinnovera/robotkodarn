import CookieAuth from 'hapi-auth-cookie'
import { User } from '../models/user'

// -----------------------------------------------------------------------------
// Get one user using email [POST]
// -----------------------------------------------------------------------------
const signIn = (request, reply) => {
	if (!request.payload.email || !request.payload.password) {
		return reply({ message: 'Missing email or password' }).code(401)
	}

	User.findOne({ email: request.payload.email }, (error, user) => {
		if (error) return reply(error).code(500)

		// Email found, check if password is correct
		if (user) {
			const { _id, name, email, starredWorkshops, role } = user
			if (user.password === request.payload.password) {
				request.cookieAuth.set({ _id })
				reply({
					user: { _id, name, email, starredWorkshops, role }
				}).code(200)
			} else {
				// TODO: Check how to response with this custom message when using code 401
				reply({ error: 'Fel användarnamn och/eller lösenord' }).code(401)
			}
		} else {
			// Email doesn't exist in db
			reply({ error: 'Fel användarnamn och/eller lösenord' }).code(401)
		}
	}).populate('starredWorkshops')
}

// -----------------------------------------------------------------------------
// Check if user is complete and authorized. [GET]
// Replies with user role (superadmin/editor)
// -----------------------------------------------------------------------------
const checkAuthorization = async (request, reply) => {
	const { _id } = request.auth.credentials
	try {
		const existingUser = await User.findOne({ _id })
		if (existingUser.complete) {
			reply({
				_id: existingUser._id,
				name: existingUser.name,
				email: existingUser.email,
				role: existingUser.role,
				starredWorkshops: existingUser.starredWorkshops
			}).code(200)
		} else {
			const error = new Error('Registration not completed')
			error.code = 401
			throw error
		}
	} catch (error) {
		return reply({ error: error.message }).code(error.code || 500)
	}
}

// -----------------------------------------------------------------------------
// Clear cookie when logging out
// -----------------------------------------------------------------------------
const logout = (request, reply) => {
	request.cookieAuth.clear()
	reply({ message: 'auth/logout' })
}

exports.register = (server, options, next) => {
	server.register(CookieAuth, (error) => {
		if (error) throw error

		server.auth.strategy('session', 'cookie', {
			password: process.env.AUTH_KEY,
			isSecure: process.env.NODE_ENV === 'production',
			cookie: 'robotkodarn',
			isHttpOnly: true
		})

		server.route([
			{
				method: 'POST',
				path: '/auth/signIn',
				config: {
					handler: signIn,
					auth: {
						mode: 'try',
						strategy: 'session'
					},
					plugins: {
						'hapi-auth-cookie': {
							redirectTo: false
						}
					}
				}
			},
			{
				method: 'GET',
				path: '/auth/checkAuthorization',
				config: {
					handler: checkAuthorization,
					auth: 'session'
				}
			},
			{
				method: 'GET',
				path: '/auth/logout',
				config: {
					handler: logout,
					auth: 'session'
				}
			}])

		next()
	})
}

exports.register.attributes = {
	name: 'auth'
}
