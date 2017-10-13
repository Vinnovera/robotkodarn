import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import adminpage from './adminpage'
import editor from './editor'
import invite from './invite'
import login from './login'
import sidebar from './sidebar'
import workspace from './workspace'
import menu from './menu'
import user from './user'

export default combineReducers({
  routeReducer,
  adminpage,
  editor,
  invite,
  login,
  sidebar,
  workspace,
  menu,
  user
})
