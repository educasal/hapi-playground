'use strict'
const Hapi = require('hapi');

const server = new Hapi.server({
  host: 'localhost',
  port: 8000
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => ('hello hapi')
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, h) {
        return `Hello, ${encodeURIComponent(request.params.name)}!`;
    }
});

async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
};

start();
