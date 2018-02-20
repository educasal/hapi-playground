'use strict'
const Boom = require('boom');
const Good = require('good');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8000, host: 'localhost' });

let registerOptions = {
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

server.register({
  register: Good,
  options: registerOptions
}, (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/{splat*}',
    handler: (request, reply) => {
      server.log('info', 'Asking for /');
      reply(Boom.notFound());
    }
  });

  server.route({
      method: 'GET',
      path: '/users/{name}',
      handler: function (request, reply) {
          reply(`Hello, ${encodeURIComponent(request.params.name)}!`);
      }
  });

  server.route({
      method: 'GET',
      path: '/files/{file}.jpg',
      handler: function (request, reply) {
          reply(Promise.resolve(`Asking for JPG: ${encodeURIComponent(request.params.file)}!`));
      }
  });

  server.start((err) => {
    if (err) {
      throw err;
    }
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
