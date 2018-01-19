import axios from 'axios'

const ADD_STARRED_WORKSHOP_START = 'ADD_STARRED_WORKSHOP_START'
const ADD_STARRED_WORKSHOP_DONE = 'ADD_STARRED_WORKSHOP_DONE'

const REMOVE_STARRED_WORKSHOP_START = 'REMOVE_STARRED_WORKSHOP_START'
const REMOVE_STARRED_WORKSHOP_DONE = 'REMOVE_STARRED_WORKSHOP_DONE'

// -----------------------------------------------------------------------------
// Star a workshop
// -----------------------------------------------------------------------------
export const starWorkshop = (workshopId, userId) => (dispatch) => {
	dispatch({
		type: ADD_STARRED_WORKSHOP_START,
		payload: workshopId
	})
	axios
		.post(`/api/user/${userId}/star`, { workshopId }, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(({ data }) => {
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
export const unstarWorkshop = (workshopId, userId) => (dispatch) => {
	dispatch({
		type: REMOVE_STARRED_WORKSHOP_START,
		payload: workshopId
	})

	axios
		.delete(`/api/user/${userId}/star/${workshopId}`, {
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
