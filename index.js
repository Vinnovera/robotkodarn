require('babel-register')({
	babelrc: false,
	plugins: [
		'transform-es2015-modules-commonjs'
	]
})
require('./server')
