import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import sidebar from './sidebar'
import editor from './editor'
import admin from './admin'
import user from './user'
import student from './student'
import login from './login'
import adminpage from './adminpage'
import invite from './invite'

export default combineReducers({
  routeReducer,
  sidebar,
  editor,
  admin,
  user,
  student,
  login,
  adminpage,
  invite
})
