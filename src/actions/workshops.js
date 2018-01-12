import axios from 'axios'
import { routeActions } from 'redux-simple-router'

const SET_WORKSHOPS = 'SET_WORKSHOPS'
const ADD_WORKSHOP = 'ADD_WORKSHOP'
const REMOVE_WORKSHOP = 'REMOVE_WORKSHOP'
const SET_MESSAGE = 'SET_MESSAGE'
const UPDATE_WORKSHOP_TITLE_START = 'UPDATE_WORKSHOP_TITLE_START'
const UPDATE_WORKSHOP_TITLE_DONE = 'UPDATE_WORKSHOP_TITLE_DONE'
const SET_WORKSHOP_BY_PIN = 'SET_WORKSHOP_BY_PIN'
const SET_CURRENT_EDITING_TYPE = 'SET_CURRENT_EDITING_TYPE'
const TOGGLE_EDITING = 'TOGGLE_EDITING'
const SET_EDITING_TYPE = 'SET_EDITING_TYPE'
const UPDATE_TIMESTAMP = 'UPDATE_TIMESTAMP'

// -----------------------------------------------------------------------------
// updateWorkshopTitle, updates the workshop title in current workshop
// -----------------------------------------------------------------------------
export const updateWorkshopTitle = (workshopId, title) => (dispatch) => {
	dispatch({
		type: UPDATE_WORKSHOP_TITLE_START,
		payload: title
	})

	axios
		.put(`/api/workshop/${workshopId}`, { title }, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(({ data }) => {
			dispatch({
				type: UPDATE_WORKSHOP_TITLE_DONE,
				payload: data.title
			})
		})
		.catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// getWorkshopsByUserId, get logged in users' workshops
// -----------------------------------------------------------------------------
export const getWorkshopsByUserId = () => (dispatch) => {
	axios
		.get('/api/workshopsbyuser', {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then((response) => {
			dispatch({ type: SET_WORKSHOPS, payload: response.data })
		})
		.catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// createWorkshop, creates empty workshop with a title and a PIN
// -----------------------------------------------------------------------------
export const createWorkshop = workshop => (dispatch) => {
	axios
		.post('/api/workshop', workshop, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(({ data }) => {
			dispatch({
				type: ADD_WORKSHOP,
				payload: data
			})

			dispatch({
				type: SET_MESSAGE,
				payload: `Workshopen ${data.title} är nu tillagd med pinkoden: ${data.pincode}.`,
				time: +new Date()
			})
		})
		.catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// Copy an existing workshop
// -----------------------------------------------------------------------------
export const copyWorkshop = workshopId => (dispatch) => {
	axios
		.post(`/api/copyWorkshop/${workshopId}`, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(({ data }) => {
			dispatch({
				type: ADD_WORKSHOP,
				payload: data
			})

			dispatch({
				type: SET_MESSAGE,
				payload: `Workshopen ${data.title} är nu tillagd med pinkoden: ${data.pincode}.`,
				time: +new Date()
			})
		})
		.catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// deleteWorkshop, removes workshop from database
// -----------------------------------------------------------------------------
export const deleteWorkshop = workshopId => (dispatch) => {
	axios
		.delete(`/api/workshop/${workshopId}`, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(({ data }) => {
			dispatch({
				type: REMOVE_WORKSHOP,
				payload: data.id
			})

			dispatch({
				type: SET_MESSAGE,
				payload: 'Workshopen är nu borttagen.',
				time: +new Date()
			})
		})
		.catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// findWorkshopByPin, gets workshop by typed in PIN in the login page
// -----------------------------------------------------------------------------
export const findWorkshopByPin = pin => (dispatch) => {
	axios
		.get(`/api/workshop/pin/${pin}`, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then((response) => {
			if (response.status === 200) {
				dispatch({
					type: SET_WORKSHOP_BY_PIN,
					payload: response.data
				})
			}
		})
		.catch(() => {
			dispatch({
				type: UPDATE_TIMESTAMP,
				payload: +new Date()
			})

			dispatch(routeActions.push('/login'))
		})
}

//------------------------------------------------------------------------------
// clearWorkshop, resets state to null when leaving workspace component.
// -----------------------------------------------------------------------------
export const clearWorkshop = () => (dispatch) => {
	dispatch({ type: SET_WORKSHOP_BY_PIN, payload: null })
}

//------------------------------------------------------------------------------
// setCurrentEditingType, sets the current editing type to part with an
// index of that part or link with that index
// -----------------------------------------------------------------------------
export const setCurrentEditingType = editingType => (dispatch) => {
	dispatch({
		type: SET_CURRENT_EDITING_TYPE,
		payload: editingType
	})
}

// -----------------------------------------------------------------------------
// toggleEditing, used if editor/superadmin is logged in and wants
// to start editing currentWorkshop
// -----------------------------------------------------------------------------
export const toggleEditing = () => (dispatch) => {
	dispatch({
		type: TOGGLE_EDITING
	})
}

// -----------------------------------------------------------------------------
// setEditingType, sets the type of content to be edited.
// If ID is provided, part/link is to be be updated.
// Else: create new.
// -----------------------------------------------------------------------------
export const setEditingType = (type, id = null) => (dispatch) => {
	dispatch({
		type: SET_EDITING_TYPE,
		payload: {
			type,
			id
		}
	})
}
