const SET_EDITOR_TAB = 'SET_EDITOR_TAB'
const SET_EDITOR_FONT_SIZE = 'SET_EDITOR_FONT_SIZE'

// -----------------------------------------------------------------------------
// changeEditorTab, sets state to pressed tab
// -----------------------------------------------------------------------------
export const changeEditorTab = userOrOriginal => (dispatch) => {
	dispatch({
		type: SET_EDITOR_TAB,
		payload: userOrOriginal
	})
}

// -----------------------------------------------------------------------------
// changeEditorFontSize, sets editor font size
// -----------------------------------------------------------------------------
export const changeEditorFontSize = userOrOriginal => (dispatch) => {
	dispatch({
		type: SET_EDITOR_FONT_SIZE,
		payload: userOrOriginal
	})
}
