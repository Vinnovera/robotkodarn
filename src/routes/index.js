import axios from 'axios'
import { store } from '../index'
import { signOut } from '../actions/auth'

const SET_LOGGED_IN_STATUS = 'SET_LOGGED_IN_STATUS'

/**
 * Check if user is logged in. If route is restricted to certain user roles,
 * also check if user has the required role.
 * If logged in, dispatch to state with credentials.
 *
 * @param {object} nextState
 * @param {function} replace Takes a string, and redirect to that path
 * @param {function} callback Called when function is complete
 */
export const authorize = (nextState, replace, callback) => {
	// The second one in the array is the route we are requesting
	const route = nextState.routes[1]

	axios.get('/auth/checkAuthorization')
		.then(({ data }) => {
			// If data is returned, dispatch information about user
			if (data) {
				store.dispatch({
					type: SET_LOGGED_IN_STATUS,
					payload: {
						isLoggedIn: true
					}
				})
			}

			/* If route.forward === 'onlyAuthCheck',
			 * return straight after dispatching (no redirect).
			 */
			if (route.forward === 'onlyAuthCheck') {
				return
			} else if (route.forward) {
				return replace(route.forward)
			}

			/* If route requires specific user role for accessing,
			 * make sure user has the right permissions.
			 */
			if (route.permissions.length > 0) {
				const isAuthorized = route.permissions.indexOf(data.role) !== -1

				if (!isAuthorized) {
					store.dispatch(signOut('/admin'))
					return replace('/admin')
				}
			}
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
