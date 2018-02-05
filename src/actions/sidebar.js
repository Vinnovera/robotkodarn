const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'

// -----------------------------------------------------------------------------
// toggleSidebar, sets if sidebar is shown or not to state
// -----------------------------------------------------------------------------
export const toggleSidebar = toggleValue => (dispatch) => {
	dispatch({
		type: TOGGLE_SIDEBAR,
		payload: toggleValue
	})
}
