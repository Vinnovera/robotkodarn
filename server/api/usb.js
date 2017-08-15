const Avrgirl = require('avrgirl-arduino')

const uploadCode = (request, reply) => {
  // TODO: Remove commented out code if not used!

  // kind of what you need to specify your own robot?

  // var board = {
  //     name: 'zumo',
  //     baud: 57600,
  //     signature: new Buffer([0x1e, 0x95, 0x87]),
  //     productId: ['0x0036', '0x8036', '0x800c', '0x8036', '0x2300'],
  //     protocol: 'avr109'
  // }

  // Avrgirl.list((err, ports) => {
  //     console.log( ports )
  // })

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
