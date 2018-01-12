import axios from 'axios'

const UPDATE_LINKS_START = 'UPDATE_LINKS_START'
const UPDATE_LINKS_DONE = 'UPDATE_LINKS_DONE'
const ADD_LINK_START = 'ADD_LINK_START'
const ADD_LINK_DONE = 'ADD_LINK_DONE'
const UPDATE_LINK_DONE = 'UPDATE_LINK_DONE'
const UPDATE_LINK_START = 'UPDATE_LINK_START'
const LINK_SAVED = 'LINK_SAVED'
const REMOVE_LINK_START = 'REMOVE_LINK_START'
const REMOVE_LINK_DONE = 'REMOVE_LINK_DONE'
const SET_ACTIVE_LINK_INDEX = 'SET_ACTIVE_LINK_INDEX'

// -----------------------------------------------------------------------------
// updateWorkshopLinks, updates the workshop links in current workshop
// -----------------------------------------------------------------------------
export const updateWorkshopLinks = (updatedLinks, workshopId, linkIds) => (dispatch) => {
	dispatch({
		type: UPDATE_LINKS_START,
		payload: updatedLinks
	})

	axios
		.put(`/api/workshop/${workshopId}/links`, linkIds, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(({ data }) => {
			dispatch({
				type: UPDATE_LINKS_DONE,
				payload: data.links
			})
		})
		.catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// addLink, creates link and add it to workshop in database
// -----------------------------------------------------------------------------
export const addLink = (link, workshopId) => (dispatch) => {
	dispatch({
		type: ADD_LINK_START
	})

	axios
		.post(`/api/workshop/${workshopId}/link`, link, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(({ data }) => {
			dispatch({
				type: ADD_LINK_DONE,
				payload: data
			})
		})
		.catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// updateLink, edits a specific link in a workshop
// -----------------------------------------------------------------------------
export const updateLink = (linkObject, workshopID, linkId) => (dispatch) => {
	dispatch({
		type: UPDATE_LINK_START,
		payload: {
			title: linkObject.title,
			linkId: linkId
		}
	})

	axios
		.put(`/api/workshop/${workshopID}/link/${linkId}`, { title: linkObject.title }, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(({ data }) => {
			dispatch({
				type: UPDATE_LINK_DONE,
				payload: data
			})

			dispatch({
				type: LINK_SAVED,
				payload: true
			})

			setTimeout(() => {
				dispatch({
					type: LINK_SAVED,
					payload: false
				})
			}, 2000)
		})
		.catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// removeLink, removes link from database
// -----------------------------------------------------------------------------
export const removeLink = (linksAfterDeletion, linkId, workshopId) => (dispatch) => {
	dispatch({
		type: REMOVE_LINK_START,
		payload: linksAfterDeletion
	})

	axios
		.delete(`/api/workshop/${workshopId}/link/${linkId}`, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then(({ data }) => {
			dispatch({
				type: REMOVE_LINK_DONE,
				payload: data
			})
		})
		.catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// setActiveLinkIndex, set active link index
// -----------------------------------------------------------------------------
export const setActiveLinkIndex = linkIndex => (dispatch) => {
	dispatch({
		type: SET_ACTIVE_LINK_INDEX,
		payload: linkIndex
	})
}
