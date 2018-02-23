const SET_CONSOLE_OUTPUT = 'SET_CONSOLE_OUTPUT'
const CLEAR_CONSOLE = 'CLEAR_CONSOLE'
const SHOW_CONSOLE = 'SHOW_CONSOLE'

// -----------------------------------------------------------------------------
// setConsoleOutput
// -----------------------------------------------------------------------------
/**
 * Sets output message shown in console. Takes an object with three props.
 * Type can be:
 *
 * 1. Info (blue heading)
 * 2. Success (green heading)
 * 3. Warning (red heading)
 *
 * If no type provided, heading will be black.
 */
export const setConsoleOutput = output => (dispatch) => {
	dispatch({
		type: SET_CONSOLE_OUTPUT,
		payload: {
			type: output.type,
			heading: output.heading,
			message: output.message
		}
	})
}

// -----------------------------------------------------------------------------
// clearConsole, clears console
// -----------------------------------------------------------------------------
export const clearConsole = () => (dispatch) => {
	dispatch({
		type: CLEAR_CONSOLE
	})
}

// -----------------------------------------------------------------------------
// toggleConsole, show or hide
// -----------------------------------------------------------------------------
export const showConsole = () => (dispatch) => {
	dispatch({
		type: SHOW_CONSOLE
	})
}
