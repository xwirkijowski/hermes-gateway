import dotenv from 'dotenv';
dotenv.config();

const env = process.env;
if (!env.NODE_ENV) env.NODE_ENV = 'development';

const config = {};
config.debug = (env.NODE_ENV === 'development');
config.port = env.PORT;

if (!config.port) throw new Error('Unspecified port, cannot proceed');

export { config, env };