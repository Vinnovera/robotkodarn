import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { syncHistory } from 'redux-simple-router'
import thunkMiddleware from 'redux-thunk'

import reducers from './reducers'
import { authorize } from './routes'

import App from './components/App'
import Editor from './components/Editor'
import Student from './components/Student'
import LoginWithPin from './components/LoginWithPin'
import LoginAdmin from './components/LoginAdmin'
import AdminPage from './components/AdminPage'
import Workshops from './components/Workshops'
import Invite from './components/Invite'
import RegisterForm from './components/RegisterForm'

import './index.css'

// Enable Redux DevTools
const enhancers = compose(
  window.devToolsExtension ?
    window.devToolsExtension() :
    f => f
)

const reduxRouterMiddleware = syncHistory(browserHistory)
const createStoreWithMiddleware = compose(applyMiddleware(
  reduxRouterMiddleware,
  thunkMiddleware
), enhancers)(createStore)
export const store = createStoreWithMiddleware(reducers)

/**
 * If we where to upgrade to react-router-4, onEnter needs to be exchanged
 * since react-router has changed a lot from the version we are currently using.
 */
render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRedirect to="/login" />
        <Route path="/pin" component={Student} onEnter={authorize} forward="onlyAuthCheck" />
        <Route path="/editor" component={Editor} onEnter={authorize} forward="onlyAuthCheck" />
        <Route path="/id/:pin" component={Student} onEnter={authorize} forward="onlyAuthCheck" />
        <Route path="/login" component={LoginWithPin} onEnter={authorize} forward="onlyAuthCheck" />
        <Route path="/admin" component={LoginAdmin} onEnter={authorize} forward="/workshops" />
        <Route path="/adminpage" component={AdminPage} onEnter={authorize} permissions={['superadmin', 'editor']} />
        <Route path="/workshops" component={Workshops} onEnter={authorize} permissions={['superadmin', 'editor']} />
        <Route path="/invite" component={Invite} onEnter={authorize} permissions={['superadmin']} />
        <Route path="/register" component={RegisterForm} onEnter={authorize} forward="/workshops" />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'))
