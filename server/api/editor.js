const util = require('util')
const avrpizza = require('avr-pizza')
const tmp = require('tmp')
const fs = require('fs')
const thePath = require('path')

/* Node utility
 * Converts a callback-based function to a Promise-based one.
 */
const writeFile = util.promisify(fs.writeFile)

/**
 * Creates a temporary file and uses avrpizza to compile and return hex code.
 * If no error occurs, the function returns the compiled hex code.
 *
 * @param {object} request
 * @param {objecy} reply Replies with 200 (and with hex code) or 400
 */
const compileCode = (request, reply) => {
	tmp.file((error, path, fd, cleanupCallback) => {
		if (error) {
			throw error
		}

		let board = request.headers['x-board'] || 'uno'

		if (board === 'zumo') board = 'leonardo'

		/*
		 * Simple sketch with no
		 * custom library dependencies
		 */
		const pkg = {
			sketch: path,
			board: board,
			libraries: [
				`${thePath.resolve(__dirname)}/../arduino-libraries/Pushbutton`,
				`${thePath.resolve(__dirname)}/../arduino-libraries/QTRSensors`,
				`${thePath.resolve(__dirname)}/../arduino-libraries/ZumoMotors`,
				`${thePath.resolve(__dirname)}/../arduino-libraries/ZumoReflectanceSensorArray`,
				`${thePath.resolve(__dirname)}/../arduino-libraries/Zumo32U4`
			],
			service: {
				host: process.env.COMPILERSERVICE_HOST,
				port: +process.env.COMPILERSERVICE_PORT
			}
		}

		/*
		 * Takes the temporary path and stores the payload so that
		 * avrpizza can compile the code.
		 */
		writeFile(path, request.payload)
			.then(avrpizza.compile(pkg, (compileError, hex) => {
				cleanupCallback()

				if (!compileError) {
					return reply(hex).code(200)
				}

				return reply({
					error: compileError.message.match(/.+?error:\s(.+)/)[1]
				}).code(400)
			}))
	})
}

exports.register = (server, options, next) => {
	server.route([{
		method: 'POST',
		path: '/api/editor',
		config: {
			handler: compileCode
		}
	}])
	next()
}

exports.register.attributes = {
	name: 'editor'
}
