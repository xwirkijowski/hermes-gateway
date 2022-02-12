import dotenv from 'dotenv';
dotenv.config();

const env = process.env;
if (!env.NODE_ENV) env.NODE_ENV = 'development';

const config = {};
config.env = env.NODE_ENV;
config.debug = (config.env === 'DEVELOPMENT');
config.port = env.PORT;

if (!config.port) throw new Error('Unspecified port, cannot proceed');

config.sentry = env.SENTRY;

config.redis = {};

config.hermes = 'http://localhost:4010/api';
config.defaultRedirect = 'https://wirkijowski.group/';
config.cacheTime = 1800;

export default config;