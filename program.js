// Dependencies
var Hapi = require('hapi');
var Path = require('path');
var fs = require('fs');
var rot13 = require("rot13-transform");

var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: Number(process.argv[2] || 8080)
});

// server.route ({
// 	path: '/', 
// 	method:'GET', 
// 	handler: { file: Path.join(__dirname, '/index.html')}
// });

server.route ({
	path: '/', 
	method:'GET', 
	handler: transformROT13Handler
	// handler: { 
	// 	view: 'index.html'
	// }
});

function transformROT13Handler ( request, reply ) {
	reply(fs.createReadStream('./public/example.txt')
		.pipe(rot13()));
}

server.route ({
	path: '/{name}', 
	method:'GET', 
	handler: handlerFunction
});

server.route ({
	path: '/foo/bar/baz/{param}',
	method: 'GET',
	handler: { 
		directory: { 
			path: Path.join(__dirname, './public/')
		} 
	}
});

server.route ({
	path: '/proxy',
	method: 'GET',
	handler: {
		proxy: {
            host: '127.0.0.1',
            port: 65535
        }
	}
});

server.views({
    helpersPath: 'helpers',
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, 'templates')
});

// function defaultRouteHandler(request, reply) {

//     //request has all information
//     //reply handles client response
//     reply({file: "index.html"});
// }

function handlerFunction(request, reply) {

    //request has all information
    //reply handles client response
    reply('Hello ' + encodeURIComponent(request.params.name));
}

server.start();