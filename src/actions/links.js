import axios from 'axios'

const UPDATE_LINKS = 'UPDATE_LINKS'
const ADD_LINK = 'ADD_LINK'
const UPDATE_LINK = 'UPDATE_LINK'
const LINK_SAVED = 'LINK_SAVED'
const REMOVE_LINK = 'REMOVE_LINK'
const SET_ACTIVE_LINK_INDEX = 'SET_ACTIVE_LINK_INDEX'

// -----------------------------------------------------------------------------
// updateWorkshopLinks, updates the workshop links in current workshop
// -----------------------------------------------------------------------------
export const updateWorkshopLinks = (workshopId, linkIds) => (dispatch) => {
  axios
    .put(`/api/workshop/${workshopId}/links`, linkIds, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: UPDATE_LINKS,
        payload: data.links
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// addLink, creates link and add it to workshop in database
// -----------------------------------------------------------------------------
export const addLink = (link, workshopId) => (dispatch) => {
  axios
    .post(`/api/workshop/${workshopId}/link`, link, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: ADD_LINK,
        payload: data
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// updateLink, edits a specific link in a workshop
// -----------------------------------------------------------------------------
export const updateLink = (updatedLinkObject, workshopID, linkId) => (dispatch) => {
  axios
    .put(`/api/workshop/${workshopID}/link/${linkId}`, updatedLinkObject, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: UPDATE_LINK,
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
export const removeLink = (linkId, workshopId) => (dispatch) => {
  axios
    .delete(`/api/workshop/${workshopId}/link/${linkId}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: REMOVE_LINK,
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
