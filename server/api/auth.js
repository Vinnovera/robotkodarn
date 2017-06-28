import config from 'config'
import CookieAuth from 'hapi-auth-cookie'
import User from '../models/user'
import { routeActions } from 'redux-simple-router'

// ----------------------------------------
// Get one user with the email [POST]
// ----------------------------------------
const signIn = (request, reply) => {
	if (!request.payload.email || !request.payload.password) {
		return reply({message: 'Missing email or password'}).code(401)
	}

	User.findOne({email: request.payload.email}, (error, user) => {
		if (error) return reply(error).code(500)

		if(user) {
			// Email found, check if password is correct

			const { _id } = user

			request.cookieAuth.set({_id})
			// console.log(request.auth.artifacts)
			return (user.password === request.payload.password)
				? reply({message: 'Logged in'}).code(200)
				: reply({message: 'Wrong username and/or password'}).code(401)
		} else {
			// Email doesn't exist in db
			reply({message: 'Wrong username and/or password'}).code(401)
		}
	})
}

const logout = (request, reply) => {
	request.cookieAuth.clear()
	reply({message: 'auth/logout'})
}

exports.register = (server, options, next) => {
	server.register(CookieAuth, (error) => {
		if (error) throw error

		server.auth.strategy('session', 'cookie', {
			password: config.get('auth.key'),
			isSecure: process.env.NODE_ENV === 'production',
			cookie: 'sid-example',
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
					strategy: 'session',
				},
				plugins: {
					'hapi-auth-cookie': {
						redirectTo: false
					}
					// auth: 'session'
				}
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
