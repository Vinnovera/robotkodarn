import config from 'config'

/**
 * Get's the current Chrome App's extension id,
 * used to connect to the app.
 *
 * @param {object} request
 * @param {object} reply Replies with the Extension ID recieved from config.
 */
const getExtensionId = (request, reply) => {
  const extensionId = config.get('chrome.extensionid')
  if (extensionId) {
    reply({ extensionId }).code(200)
  } else {
    reply().code(500)
  }
}

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'get',
      path: '/api/extensionid',
      config: {
        handler: getExtensionId
      }
    }
  ])
  next()
}

exports.register.attributes = {
  name: 'extensionid'
}
