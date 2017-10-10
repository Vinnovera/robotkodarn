import axios from 'axios'
import { store } from '../index'
import { IS_AUHTORIZED, signOut } from '../actions/authentication'

/**
 * Check if user is logged in. If route is restricted to certain user roles,
 * also check if user has the required role.
 * If logged in, dispatch to state with credentials.
 *
 * @param {object} nextState An object with
 * @param {function} replace Takes a string, and redirect to that path
 * @param {function} callback Is called when function is complete
 */
export const authorize = (nextState, replace, callback) => {

  // The second one in the array is the route we are requesting
  const route = nextState.routes[1]

  axios.get('/auth/checkAuthorization')
    .then(({ data }) => {
      const userRole = data.role

      if (route.forward) {
        return replace(route.forward)
      }

      if (route.permissions.length > 0) {
        const isAuthorized = route.permissions.indexOf(userRole) !== -1

        if (!isAuthorized) {
          store.dispatch(signOut('/admin'))
          return replace('/admin')
        }
      }

      store.dispatch({
        type: IS_AUHTORIZED,
        payload: {
          ...data,
          isLoggedIn: true
        }
      })
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        if (!route.forward) {
          store.dispatch(signOut('/admin'))
          return replace('/admin')
        }
      }
    })
    .then(callback)
}
