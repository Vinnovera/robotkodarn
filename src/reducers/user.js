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
	}
}, {
	isLoggedIn: false,
	role: null,
	name: null,
	_id: null,
	starredWorkshops: []
})
