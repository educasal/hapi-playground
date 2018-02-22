'use strict'
const Boom = require('boom');
const Good = require('good');
const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');

const server = new Hapi.Server();
server.connection({ port: 8000, host: 'localhost' });

let goodOptions = {
  reporters: {
    console: [
      {
        module: 'good-console',
        args: [{ log: '*', response: '*' }]
      },
      'stdout'
    ]
  }
};

server.register([
  { register: Good, options: goodOptions },
  { register: Inert }
], (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/{splat*}',
    handler: (request, reply) => {
      server.log('error', 'Asking for /');
      reply(Boom.notFound());
    }
  });

  server.route({
    method: 'GET',
    path: '/users/{name}',
    handler: function (request, reply) {
      reply(`Hello, ${encodeURIComponent(request.params.name)}!`)
      .type('text/plain')
      .code(418);;
    }
  });

  //Specific route for images, always the same one
  server.route({
    method: 'GET',
    path: '/images/{image}.jpg',
    handler: function (request, reply) {
      server.log('error', `Redirecting to default JPG instead of ${encodeURIComponent(request.params.image)}!`);
      const path = Path.join(__dirname, 'public/images/waterme.jpg')
      reply.file(path);
    }
  });

  //Generic routing to a directory
  server.route({
    method: 'GET',
    path: '/files/{file*}',
    handler: {
      directory: {
        path: Path.join(__dirname, 'public')
      }
    }
  });

  server.start((err) => {
    if (err) {
      throw err;
    }
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
