import dotenv from 'dotenv';
dotenv.config({path: `.env${(process.env.NODE_ENV) ? '.'+process.env.NODE_ENV.toLowerCase() : ''}`});

const env = process.env;
if (!env.NODE_ENV) env.NODE_ENV = 'DEVELOPMENT';

const config = {};
config.env = env.NODE_ENV;
config.debug = (config.env === 'DEVELOPMENT');
config.port = env.PORT;

if (!config.port) throw new Error('Unspecified port, cannot proceed');

config.sentry = env.SENTRY;

config.redis = {
	host: env.REDIS
};

config.hermes = env.HERMES;
config.defaultRedirect = 'https://wirkijowski.group/';
config.cacheTime = 1800;

export default config;