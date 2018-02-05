exports.register = (server, options, next) => {
	server.route([
		{
			method: 'GET',
			path: '/static/{param*}',
			handler: {
				directory: {
					path: 'client/static'
				}
			}
		},
		{
			method: 'GET',
			path: '/{path*}',
			handler: {
				file: 'client/index.html'
			}
		}
	])

	next()
}

exports.register.attributes = {
	name: 'base'
}
