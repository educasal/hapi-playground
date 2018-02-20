'use strict'
const Hapi = require('hapi');
const Good = require('good');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

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
    path: '/',
    handler: (request, reply) => {
      server.log('error', 'CATACRASH');
      server.log('info', 'Asking for /');
      reply('hello hapi');
    }
  });

  server.route({
      method: 'GET',
      path: '/{name}',
      handler: function (request, reply) {
          reply(`Hello, ${encodeURIComponent(request.params.name)}!`);
      }
  });

  server.start((err) => {
    if (err) {
      throw err;
    }
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
