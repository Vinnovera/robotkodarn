import { routeActions } from 'redux-simple-router'
import axios from 'axios'

// -----------------------------------------------------------------------------
// signIn, takes email and hashed input
// -----------------------------------------------------------------------------
export const signIn = (credentials, path) => (dispatch) => {
  const data = JSON.stringify(credentials)

  axios.post('/auth/signIn', data, {
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(() => dispatch(routeActions.push(path)))
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// signOut, clears cookies
// -----------------------------------------------------------------------------
const IS_AUHTORIZED = 'IS_AUHTORIZED'

export const signOut = path => (dispatch) => {
  axios.get('/auth/logout')
    .then(() => {
      // Remove user from Redux State.
      dispatch({
        type: IS_AUHTORIZED,
        payload: null
      })
      dispatch(routeActions.push(path))
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// checkAuthorization, checks session cookie and authorization level
// -----------------------------------------------------------------------------
/**
 * Checks session cookie and role of user
 *
 * @param {string} path The path requested if session cookie exists.
 * @param {*} role The user role required for getting access to path.
 * If role is set to 'superadmin', check that the user has the required role,
 * else, redirect to adminpage.
 */
export const checkAuthorization = (path, role = 'editor') => (dispatch) => {
  axios.get('/auth/checkAuthorization')
    .then((response) => {
      dispatch({
        type: IS_AUHTORIZED,
        payload: response.data
      })

      if (role === 'superadmin' && response.data !== 'superadmin') {
        return dispatch(routeActions.push('/adminpage'))
      } else if (path !== null) {
        dispatch(routeActions.push(path))
      }
    })
    .catch(() => {
      dispatch(routeActions.push('/admin'))
    })
}
