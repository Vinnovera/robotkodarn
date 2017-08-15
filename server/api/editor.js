const avrpizza = require('avr-pizza')
const tmp = require('tmp')
const fs = require('fs')

const compileCode = (request, reply) => {
  tmp.file({
    dir: `${__dirname}/../tmp_ino`,
    postfix: '.ino',
    keep: false
  }, (err, path, fd, cleanupCallback) => {
    if (err) throw err

    // TODO: Remove commented out code if no longer used.
    // let code = JSON.stringify(request.payload)

    fs.writeFileSync(path, request.payload)

    const pkg = {
      sketch: path,
      board: 'uno'
    }

    avrpizza.compile(pkg, (error, hex) => {
      cleanupCallback()

      if (!error) {
        return reply(hex).code(200)
      }
      return reply({
        error
      }).code(400)
    })
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
