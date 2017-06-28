var avrpizza = require('avr-pizza');
var tmp = require('tmp');
var fs = require('fs');

const compileCode = (request, reply) => {

    tmp.file({dir: __dirname + '/../tmp_ino', postfix: '.ino', keep: false}, function (err, path, fd, cleanupCallback) {
        if (err) throw err

        // let code = JSON.stringify(request.payload)

        fs.writeFileSync(path, request.payload)

        var pkg = {
            sketch: path,
            board: 'uno'
        };


        avrpizza.compile(pkg, (error, hex) => {
            cleanupCallback()

            // console.log( error )

            if(!error) {
                return reply(hex).code(200)
            } else {
                return reply({error: error}).code(400)
            }
        });

    });

}



exports.register = (server, options, next) => {
	server.route([
	{
		method: 'POST',
		path: '/api/editor',
		config: {
			handler: compileCode,
		}
	}
	])
	next()
}

exports.register.attributes = {
	name: 'editor'
}