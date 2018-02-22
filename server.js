'use strict'
const Boom = require('boom');
const Good = require('good');
const Handlebars = require('handlebars');
const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');
const Vision = require('vision');

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
  { register: Inert },
  { register: Vision },
], (err) => {
  if (err) {
    throw err;
  }

  server.views({
    engines: { hbs: Handlebars },
    path: __dirname + '/templates'
  });

  //Default route, not implemented -> 404
  server.route({
    method: 'GET',
    path: '/{splat*}',
    handler: (request, reply) => {
      server.log('error', 'Asking for /');
      reply(Boom.notFound());
    }
  });

  //Simple example
  server.route({
    method: 'GET',
    path: '/users/{name}',
    handler: function (request, reply) {
      reply.view('users/show', {
        title: 'Hapi Playground | Hapi ' + request.server.version,
        message: `Hello, ${encodeURIComponent(request.params.name)}!`
      });

      // reply(`Hello, ${encodeURIComponent(request.params.name)}!`)
      // .type('text/plain')
      // .code(418);;
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
