import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { syncHistory } from 'redux-simple-router'
import thunkMiddleware from 'redux-thunk'

import reducers from './reducers'

import App from './components/App'
import Editor from './components/Editor'
import Student from './components/Student'
import Login from './components/Login'
import Admin from './components/Admin'
import AdminPage from './components/AdminPage'

import './index.css'

// import './font-awesome.min.css'
// import '../node_modules/react-fontawesome/lib/'

const reduxRouterMiddleware = syncHistory(browserHistory)
const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware, thunkMiddleware)(createStore)
const store = createStoreWithMiddleware(reducers)

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRedirect to="/login" />
        <Route path="/pin" component={Student} />
        <Route path="/editor" component={Editor} />
        <Route path="/id/:pin" component={Student} />
        <Route path="/login" component={Login} />
        <Route path="/admin" component={Admin} />
        <Route path="/adminpage" component={AdminPage} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'))
