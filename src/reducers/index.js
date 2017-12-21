import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import workshops from './workshops'
import editor from './editor'
import invite from './invite'
import sidebar from './sidebar'
import menu from './menu'
import user from './user'
import workspaceButtons from './workspaceButtons'
import statusBar from './statusBar'
import serial from './serial'

export default combineReducers({
  routeReducer,
  editor,
  invite,
  sidebar,
  workshops,
  menu,
  user,
  workspaceButtons,
  statusBar,
  serial
})
