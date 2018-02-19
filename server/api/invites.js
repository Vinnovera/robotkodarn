import { Invite } from '../models/invite'

const addInvite = async (request, reply) => {
	const { organisation } = request.payload

	try {
		const invite = new Invite()
		invite.organisation = organisation

		await invite.save()

		return reply(invite).code(200)
	} catch (error) {
		return reply({ error: error.message }).code(error.code || 500)
	}
}

exports.register = (server, options, next) => {
	server.route([
		{
			method: 'POST',
			path: '/api/invite',
			config: {
				handler: addInvite
			}
		}
	])
	next()
}

exports.register.attributes = {
	name: 'invites'
}

