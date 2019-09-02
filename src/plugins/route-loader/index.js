'use strict';

const Joi = require('@hapi/joi');
const Fs = require('fs');
const Util = require('util');
const Path = require('path');

const readDir = Util.promisify(Fs.readdir);

const routeSchema = Joi.object().keys({
    method: Joi.string().required(),
    path: Joi.string().required(),
    handler: Joi.func()
}).unknown(true);

const routeConfigSchema = Joi.alternatives().try(
    Joi.array().items(routeSchema),
    routeSchema
);

const optionsSchema = Joi.object().keys({
    routesDir: Joi.string()
});

module.exports = {
    name: 'routeLoader',
    version: '0.0.1',
    register: async function (server, options = { routesDir: 'src/routes' }) {

        const validateOptionsRes = optionsSchema.validate(options);

        if (validateOptionsRes.error) {
            throw (validateOptionsRes.error);
        }


        const routesPath = Path.resolve(options.routesDir);

        try {
            const fileList = await readDir(routesPath);

            const routesList = fileList.filter((file) => {

                return Path.extname(file).toLowerCase() === '.js';
            });

            for (let i = 0; i < routesList.length; ++i) {

                const routeConfig = require(`${routesPath}/${routesList[i]}`);

                const validateRes = routeConfigSchema.validate(routeConfig);

                if (validateRes.error) {
                    throw (validateRes.error);
                }

                server.route(routeConfig);
            }
        }
        catch (e) {

            throw (e);
        }
    }
};
