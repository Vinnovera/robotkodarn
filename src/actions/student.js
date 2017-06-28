
// ----------------------------------------
// setCurrentParts, sets parts loaded from workshop to state
// ----------------------------------------
export const setCurrentParts = (currentParts) => (dispatch) => {
	dispatch({
		type: 'SET_CURRENT_PARTS',
		payload: currentParts
	})
}

// ----------------------------------------
// toggleSidebar, sets if sidebar is shown or not to state
// ----------------------------------------
export const toggleSidebar = (toggleValue) => (dispatch) => {
	dispatch({
		type: 'SET_SIDEBAR_OPEN',
		payload: toggleValue
	})
}