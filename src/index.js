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
import Workspace from './components/Workspace'
import LoginWithPin from './components/LoginWithPin'
import LoginAdmin from './components/LoginAdmin'
import Workshops from './components/Workshops'
import Invite from './components/Invite'
import RegisterForm from './components/RegisterForm'
import NotFound from './components/NotFound'

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
				<Route path="/id/:pin" component={Workspace} onEnter={authorize} forward="onlyAuthCheck" />
				<Route path="/login" component={LoginWithPin} forward="onlyAuthCheck" />
				<Route path="/admin" component={LoginAdmin} onEnter={authorize} forward="/workshops" />
				<Route path="/workshops" component={Workshops} onEnter={authorize} permissions={['superadmin', 'editor']} />
				<Route path="/invite" component={Invite} onEnter={authorize} permissions={['superadmin']} />
				<Route path="/register" component={RegisterForm} onEnter={authorize} forward="/workshops" />
				<Route path="*" component={NotFound} onEnter={authorize} forward="onlyAuthCheck" />
			</Route>
		</Router>
	</Provider>
), document.getElementById('root'))
