const util = require('util')
const avrpizza = require('avr-pizza')
const tmp = require('tmp')
const fs = require('fs')

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

    /*
     * Simple sketch with no
     * custom library dependencies
     */
    const pkg = {
      sketch: path,
      board: 'uno' // Hardcoded during development
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
