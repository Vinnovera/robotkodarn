import { handleActions } from 'redux-actions'

export default handleActions({
	SET_LOGGED_IN_STATUS: (state, action) => {
		return ({
			...state,
			isLoggedIn: action.payload.isLoggedIn
		})
	},

	SET_USER_INFO: (state, action) => {
		return ({
			...state,
			_id: action.payload._id,
			name: action.payload.name,
			role: action.payload.role,
			email: action.payload.email,
			starredWorkshops: action.payload.starredWorkshops
		})
	},

	ADD_STARRED_WORKSHOP_START: (state, action) => {
		return ({
			...state,
			starredWorkshops: [...state.starredWorkshops, { _id: action.payload }],
			isStarringWorkshop: true
		})
	},

	ADD_STARRED_WORKSHOP_DONE: (state) => {
		return ({
			...state,
			isStarringWorkshop: false
		})
	},

	REMOVE_STARRED_WORKSHOP_START: (state, action) => {
		return ({
			...state,
			starredWorkshops: [...state.starredWorkshops].filter(workshop => workshop._id !== action.payload),
			isUnstarringWorkshop: true
		})
	},

	REMOVE_STARRED_WORKSHOP_DONE: (state) => {
		return ({
			...state,
			isUnstarringWorkshop: false
		})
	}
}, {
	isLoggedIn: false,
	role: null,
	name: null,
	_id: null,
	starredWorkshops: [],
	email: null,
	isStarringWorkshop: false,
	isUnstarringWorkshop: false
})
