import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import admin from './admin'
import adminpage from './adminpage'
import editor from './editor'
import invite from './invite'
import login from './login'
import sidebar from './sidebar'
import workspace from './workspace'
import tools from './tools'
import user from './user'

export default combineReducers({
  routeReducer,
  admin,
  adminpage,
  editor,
  invite,
  login,
  sidebar,
  workspace,
  tools,
  user
})
