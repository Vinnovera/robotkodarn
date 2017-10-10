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
        payload: {
          isLoggedIn: false
        }
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
        payload: {
          ...response.data,
          isLoggedIn: true
        }
      })

      if (role === 'superadmin' && response.data.role !== 'superadmin') {
        return dispatch(routeActions.push('/adminpage'))
      } else if (path !== null) {
        dispatch(routeActions.push(path))
      }
    })
    .catch(() => {
      dispatch(routeActions.push('/admin'))
    })
}

// -----------------------------------------------------------------------------
// checkAuthorization, checks session cookie and authorization level
// -----------------------------------------------------------------------------
/**
 * Checks session cookie and role of user
 *
 * @param {string} redirect
 * @param {*} role The user role required for getting access to path.
 * If role is set to 'superadmin', check that the user has the required role,
 * else, redirect to adminpage.
 */
export const requireAuth = (redirect = null, role = 'editor', callback) => (dispatch) => {
  axios.get('/auth/checkAuthorization')
    .then((response) => {
      dispatch({
        type: IS_AUHTORIZED,
        payload: {
          ...response.data,
          isLoggedIn: true
        }
      })

      if (role === 'superadmin' && response.data.role !== 'superadmin') {
        return dispatch(routeActions.push('/adminpage'))
      } else if (redirect !== null) {
        dispatch(routeActions.push(redirect))
      }
    })
    .catch(() => {
      dispatch(routeActions.push('/admin'))
    })
    .then(callback)
}


// export const requireAuthOld = (nextState, replace, callback) => {
//   request
//     .get('/auth/ping')
//     .then(({ data }) => {
//       const userScope = data.scope;
//       const allowedScopes = _.flattenDeep(nextState.routes.filter(route => route.scope).map(route => route.scope))
//       if (!allowedScopes.includes(userScope)) {
//         replace('/admin/401')
//       }
//       store.dispatch({
//         type: 'AUTH_INFO',
//         payload: data
//       });
//     })
//     .catch((error) => {
//       if (error.response && error.response.status === 401) {
//         store.dispatch(logout());
//         replace('/admin/logout')
//       }
//     })
//     .then(callback);
// };
