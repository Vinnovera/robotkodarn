import { routeActions } from 'redux-simple-router'
import axios from 'axios'

const SET_MESSAGE = 'SET_MESSAGE'
const SET_WORKSHOPS = 'SET_WORKSHOPS'
const SET_WORKSHOP = 'SET_WORKSHOP'

// -----------------------------------------------------------------------------
// createWorkshop, creates empty workshop with a title and a PIN
// -----------------------------------------------------------------------------
export const createWorkshop = credentials => (dispatch) => {
  axios
    .post('/api/workshop', credentials, {
      headers: {
        'content-type': 'application/json'
      }
    })
    // 'response' is not used but kept for documentation purposes.
    .then((/* response */) => {
      dispatch({
        type: SET_MESSAGE,
        payload: `Workshopen ${credentials.title} är nu tillagd med pinkoden: ${credentials.pincode}.`
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// Copy an existing workshop
// -----------------------------------------------------------------------------
export const copyWorkshop = workshopID => () => {
  axios
    .post(`/api/copyWorkshop/${workshopID}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// changeTitle, edits the title of the workshop object
// -----------------------------------------------------------------------------
export const changeTitle = (credentials, workshop) => (dispatch) => {
  axios
    .put(`/api/workshop/${workshop._id}`, credentials, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((/* response */) => {
      dispatch({
        type: SET_MESSAGE,
        payload: `Workshopen ${workshop.title} har nu titeln ${credentials.title}.`
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// addPart, adds part to workshop
// -----------------------------------------------------------------------------
export const addPart = (credentials, workshop) => (dispatch) => {
  axios
    .post(`/api/workshop/${workshop._id}/part`, credentials, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response) => {
      dispatch({ type: 'SET_PARTS', payload: response.data })

      dispatch({
        type: SET_MESSAGE,
        payload: `Workshopen ${workshop.title} har nu delmomentet ${credentials.title}.`
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// addLink, adds link to workshop
// -----------------------------------------------------------------------------
export const addLink = (credentials, workshop) => (dispatch) => {
  axios
    .post(`/api/workshop/${workshop._id}/link`, credentials, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((/* response */) => {
      dispatch({
        type: SET_MESSAGE,
        payload: `Workshopen ${workshop.title} har nu referenslänken ${credentials.title}.`
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// removeSelectedPart, removes part from database
// -----------------------------------------------------------------------------
export const removeSelectedPart = (part, workshop) => (dispatch) => {
  axios
    .delete(`/api/workshop/${workshop}/part/${part}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((/* response */) => {
      dispatch({
        type: SET_MESSAGE,
        payload: `Delmomentet ${part.title} är nu borttaget.`
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// removeSelectedLink, removes link from database
// -----------------------------------------------------------------------------
export const removeSelectedLink = (link, workshop) => (dispatch) => {
  axios
    .delete(`/api/workshop/${workshop}/link/${link}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((/* response */) => {
      dispatch({
        type: SET_MESSAGE,
        payload: `Delmomentet ${link.title} är nu borttaget.`
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// findWorkshopByPin, gets workshop by typed in PIN in the login page
// -----------------------------------------------------------------------------
export const findWorkshopByPin = pin => (dispatch) => {
  const request = new XMLHttpRequest()
  request.open('GET', `/api/workshop/pin/${pin}`, true)

  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      dispatch({ type: SET_WORKSHOP, payload: request.response })
    } else {
      dispatch(routeActions.push('/login'))
    }
  }

  request.send()
}

//------------------------------------------------------------------------------
// clearWorkshop, resets state to null when leaving workspace component.
// -----------------------------------------------------------------------------

export const clearWorkshop = () => (dispatch) => {
  dispatch({ type: SET_WORKSHOP, payload: null })
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
// removeWorkshop, removes workshop from database
// -----------------------------------------------------------------------------
export const removeWorkshop = workshopID => () => {
  axios
    .delete(`/api/workshop/${workshopID}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// setSelectedWorkshop, sets index of selected workshop to state
// -----------------------------------------------------------------------------
export const setSelectedWorkshop = index => (dispatch) => {
  dispatch({ type: 'SET_SELECTED_WORKSHOP_INDEX', payload: index })
}

// -----------------------------------------------------------------------------
// setSelectedPart, sets index of selected part to state
// -----------------------------------------------------------------------------
export const setSelectedPart = index => (dispatch) => {
  dispatch({ type: 'SET_SELECTED_PART_INDEX', payload: index })
}

// -----------------------------------------------------------------------------
// setSelectedLink, sets index of selected link to state
// -----------------------------------------------------------------------------
export const setSelectedLink = index => (dispatch) => {
  dispatch({ type: 'SET_SELECTED_LINK_INDEX', payload: index })
}
