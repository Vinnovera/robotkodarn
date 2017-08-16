const Avrgirl = require('avrgirl-arduino')

const uploadCode = (request, reply) => {
  const avrgirl = new Avrgirl({
    board: 'uno',
    debug: true,
    manualReset: false
  })

  avrgirl.flash(new Buffer(request.payload), (error) => {
    if (error) {
      return reply({ error: error.message }).code(400)
    }

    return reply('OK').code(200)
  })
}

const pingForUSBConnection = (request, reply) => {
  Avrgirl.list((err, ports) => {
    const foundRobot = ports.filter(port => port.manufacturer !== undefined)

    return (foundRobot.length === 1) ?
      reply(foundRobot[0]).code(200) :
      reply({
        error: 'Kunde ej hitta inkopplad någon robot.'
      }).code(400)
  })
}

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/api/usb',
      config: {
        handler: uploadCode
      }
    },
    {
      method: 'GET',
      path: '/api/usb',
      config: {
        handler: pingForUSBConnection
      }
    }
  ])
  next()
}

exports.register.attributes = {
  name: 'usb'
}
