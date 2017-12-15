import { connectPort } from "../utils/chromeapp"

const SET_CHROME_PING = 'SET_CHROME_PING'
const SET_DEVICE_CONNECTED = 'SET_DEVICE_CONNECTED'

// -----------------------------------------------------------------------------
// pingChromeApp, pings the Chrome App expecting a response "pong"
// -----------------------------------------------------------------------------
export const pingChromeApp = () => (dispatch) => {
  const port = connectPort()
  const message = {
    type: 'ping'
  }

  port.postMessage(message)

  let responseFromApp = false

  port.onMessage.addListener((response) => {
    responseFromApp = response.success
  })

  setTimeout(() => {
    dispatch({
      type: SET_CHROME_PING,
      payload: responseFromApp
    })
  }, 2000)
}

// -----------------------------------------------------------------------------
// pingForUSBConnection, pings the Chrome App that retrieves a list of
// arduino devices that are connected
// -----------------------------------------------------------------------------
export const pingForUSBConnection = () => (dispatch) => {
  const port = connectPort()
  const message = {
    type: 'list'
  }

  port.postMessage(message)

  // Give user feedback when recieving message from Chrome App
  port.onMessage.addListener((response) => {
    if (!response || response.error) {
      console.error('Ingen kontakt med Chrome App eller fel vid hämtning av lista')
    } else {
      const deviceConnected = response.usbPorts.filter(usbPort => usbPort.manufacturer !== undefined).length > 0

      dispatch({
        type: SET_DEVICE_CONNECTED,
        payload: deviceConnected
      })
    }
  })
}
