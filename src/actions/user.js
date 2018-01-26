import axios from 'axios'

const ADD_STARRED_WORKSHOP_START = 'ADD_STARRED_WORKSHOP_START'
const ADD_STARRED_WORKSHOP_DONE = 'ADD_STARRED_WORKSHOP_DONE'

const REMOVE_STARRED_WORKSHOP_START = 'REMOVE_STARRED_WORKSHOP_START'
const REMOVE_STARRED_WORKSHOP_DONE = 'REMOVE_STARRED_WORKSHOP_DONE'

const SET_USER_INFO = 'SET_USER_INFO'

// -----------------------------------------------------------------------------
// Star a workshop
// -----------------------------------------------------------------------------
export const setUserInfo = () => (dispatch) => {
	axios
		.get('/api/user', {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(({ data }) => {
			dispatch({
				type: SET_USER_INFO,
				payload: data
			})
		})
		.catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// Star a workshop
// -----------------------------------------------------------------------------
export const starWorkshop = workshopId => (dispatch) => {
	dispatch({
		type: ADD_STARRED_WORKSHOP_START,
		payload: workshopId
	})
	axios
		.post('/api/user/star', { workshopId }, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(({ data }) => {
			// Run setUserInfo to populate the starred workshops to user state
			dispatch(setUserInfo())

			dispatch({
				type: ADD_STARRED_WORKSHOP_DONE,
				payload: data
			})
		})
		.catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// Unstar a workshop
// -----------------------------------------------------------------------------
export const unstarWorkshop = workshopId => (dispatch) => {
	dispatch({
		type: REMOVE_STARRED_WORKSHOP_START,
		payload: workshopId
	})

	axios
		.delete(`/api/user/star/${workshopId}`, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(({ data }) => {
			dispatch({
				type: REMOVE_STARRED_WORKSHOP_DONE,
				payload: data
			})
		})
		.catch(error => console.log(error))
}
