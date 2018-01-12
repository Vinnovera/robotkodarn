import { connectPort } from '../utils/chromeapp'

const SET_SERIAL_MESSAGE = 'SET_SERIAL_MESSAGE'

export const serialListen = (board = 'uno', baudrate = 57600) => (dispatch) => {
	const port = connectPort()

	const message = {
		type: 'serial',
		board: board,
		baudrate: baudrate
	}

	port.onMessage.addListener((response) => {
		if (response.error) return

		dispatch({
			type: SET_SERIAL_MESSAGE,
			payload: response.serialData
		})
	})

	port.postMessage(message)
}
