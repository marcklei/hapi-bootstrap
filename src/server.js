'use strict';

const Hapi = require('@hapi/hapi');
const Dotenv = require('dotenv');

Dotenv.config({});

const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT ||  3000,
        host: 'localhost'
    });

    await server.register([
        {
            plugin: require('./plugins/route-loader/index'),
            options: {
                routesDir: 'src/routes'
            }
        }
    ]);

    await server.initialize();
    return server;
};

exports.init = init;

exports.start = async () => {

    const server = await init();
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    return server;
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});
