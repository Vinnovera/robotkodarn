import { handleActions } from 'redux-actions'

export default handleActions({
	SET_USER_INFO: (state, action) => {
		return ({
			...state,
			isLoggedIn: action.payload.isLoggedIn,
			role: action.payload.role,
			name: action.payload.name,
			_id: action.payload._id,
			starredWorkshops: action.payload.starredWorkshops
		})
	},

	ADD_STARRED_WORKSHOP_START: (state, action) => {
		return ({
			...state,
			starredWorkshops: [...state.starredWorkshops, action.payload]
		})
	},

	ADD_STARRED_WORKSHOP_DONE: (state, action) => {
		return ({
			...state,
			starredWorkshops: action.payload
		})
	},

	REMOVE_STARRED_WORKSHOP_START: (state, action) => {
		return ({
			...state,
			starredWorkshops: [...state.starredWorkshops].filter(workshopId => workshopId !== action.payload)
		})
	},

	REMOVE_STARRED_WORKSHOP_DONE: (state, action) => {
		return ({
			...state,
			starredWorkshops: action.payload
		})
	}
}, {
	isLoggedIn: false,
	role: null,
	name: null,
	_id: null,
	starredWorkshops: []
})
