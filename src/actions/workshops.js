import axios from 'axios'

const SET_USER_WORKSHOPS = 'SET_USER_WORKSHOPS'
const ADD_USER_WORKSHOP = 'ADD_USER_WORKSHOP'
const REMOVE_USER_WORKSHOP = 'REMOVE_USER_WORKSHOP'
const SET_MESSAGE = 'SET_MESSAGE'

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
      dispatch({ type: SET_USER_WORKSHOPS, payload: response.data })
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
        type: ADD_USER_WORKSHOP,
        payload: data
      })

      dispatch({
        type: SET_MESSAGE,
        payload: `Workshopen ${data.title} är nu tillagd med pinkoden: ${data.pincode}.`
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// Copy an existing workshop
// -----------------------------------------------------------------------------
export const copyWorkshop = workshopID => (dispatch) => {
  axios
    .post(`/api/copyWorkshop/${workshopID}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: ADD_USER_WORKSHOP,
        payload: data
      })

      dispatch({
        type: SET_MESSAGE,
        payload: `Workshopen ${data.title} är nu tillagd med pinkoden: ${data.pincode}.`
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// deleteWorkshop, removes workshop from database
// -----------------------------------------------------------------------------
export const deleteWorkshop = workshopID => (dispatch) => {
  axios
    .delete(`/api/workshop/${workshopID}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: REMOVE_USER_WORKSHOP,
        payload: data.id
      })

      dispatch({
        type: SET_MESSAGE,
        payload: 'Workshopen är nu borttagen.'
      })
    })
    .catch(error => console.log(error))
}

