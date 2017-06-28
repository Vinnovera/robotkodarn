
const isLoggedIn = (request, reply) => {
	reply(request.auth).code(200)
}

exports.register = (server, options, next) => {
	server.route([
	{
		method: 'GET',
		path: '/api/isLoggedIn',
		config: {
			handler: isLoggedIn,
			auth: 'session'
		}
	}
	])

	next()
}

exports.register.attributes = {
	name: 'administrators'
}