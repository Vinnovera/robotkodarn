import { handleActions } from 'redux-actions'

export default handleActions({
	SET_PARTS_TO_EDIT: (state, action) => {
		return ({
			...state,
			partsToEdit: action.payload
		})
	},

	SET_EDITOR_TAB: (state, action) => {
		return ({
			...state,
			activeTab: action.payload
		})
	},

	UPDATE_CODE: (state, action) => {
		return ({
			...state,
			updatedCode: action.payload
		})
	},

	SET_COMPILER_RESPONSE: (state, action) => {
		return ({
			...state,
			compilerResponse: action.payload.compilerResponse,
			willUpload: action.payload.willUpload
		})
	},

	SET_CONSOLE_OUTPUT: (state, action) => {
		const consoleMessage = {
			key: +new Date(),
			timestamp: new Date(),
			type: action.payload.type,
			heading: action.payload.heading,
			message: action.payload.message
		}

		return ({
			...state,
			consoleOutput: [consoleMessage, ...state.consoleOutput]
		})
	},

	CLEAR_CONSOLE: (state) => {
		return ({
			...state,
			consoleOutput: []
		})
	},

	SET_ACTIVE_PART_INDEX: (state, action) => {
		return ({
			...state,
			activePartIndex: action.payload
		})
	},

	TOGGLE_EDITING: (state) => {
		return ({
			...state,
			editing: !state.editing
		})
	},

	SET_EDITING_TYPE: (state, action) => {
		return ({
			...state,
			editingType: action.payload
		})
	},

	SET_CODE_TO_UNSAVED: (state, action) => {
		return ({
			...state,
			codeIsUnsaved: action.payload
		})
	},

	SET_EDITOR_FONT_SIZE: (state, action) => {
		return ({
			...state,
			editorFontSize: action.payload
		})
	}

}, {
	activeTab: 'user',
	compilerResponse: null,
	consoleOutput: [],
	activePartIndex: 0,
	editing: false,
	editingType: {
		type: 'parts',
		id: null
	},
	partsToEdit: [],
	codeIsUnsaved: false,
	editorFontSize: 14
})
