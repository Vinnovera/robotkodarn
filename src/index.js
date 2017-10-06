import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { syncHistory } from 'redux-simple-router'
import thunkMiddleware from 'redux-thunk'

import reducers from './reducers'

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
const store = createStoreWithMiddleware(reducers)

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRedirect to="/login" />
        <Route path="/pin" component={Student} />
        <Route path="/editor" component={Editor} />
        <Route path="/id/:pin" component={Student} />
        <Route path="/login" component={LoginWithPin} />
        <Route path="/admin" component={LoginAdmin} />
        <Route path="/adminpage" component={AdminPage} />
        <Route path="/workshops" component={Workshops} />
        <Route path="/invite" component={Invite} />
        <Route path="/register" component={RegisterForm} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'))
