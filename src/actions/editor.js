const SET_EDITOR_TAB = 'SET_EDITOR_TAB'

// -----------------------------------------------------------------------------
// changeEditorTab, sets state to pressed tab
// -----------------------------------------------------------------------------
export const changeEditorTab = userOrOriginal => (dispatch) => {
	dispatch({
		type: SET_EDITOR_TAB,
		payload: userOrOriginal
	})
}
