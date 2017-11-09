import { routeActions } from 'redux-simple-router'
import axios from 'axios'

// -----------------------------------------------------------------------------
// isInvited – checks session cookie.
// 200 === cookie exists and user is not completed
// -----------------------------------------------------------------------------
export const isInvited = path => (dispatch) => {
  axios.get('/api/register/user')
    .then(() => {
      if (path !== null) {
        dispatch(routeActions.push(path))
      }
    })
    .catch(() => {
      dispatch(routeActions.push('/admin'))
    })
}

// -----------------------------------------------------------------------------
// Takes credentials and updates user with the provided information.
// Once the registration is complete, update user.complete === true
// -----------------------------------------------------------------------------
export const completeRegistration = credentials => (dispatch) => {
  axios
    .put('/api/register/user', credentials, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(() => dispatch(routeActions.push('/admin')))
    .catch((error) => {
      console.log(error) // TODO: Should dispatch an error to user
    })
}
