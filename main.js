import express from 'express';
import Redis from 'ioredis';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import helmet from 'helmet';

import config from './config';

import controller from './src/controllers/hermes.controller';

const server = express();

Sentry.init({
	dsn: config.sentry,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({ server }),
	],
	tracesSampleRate: (config.debug) ? 1.0 : 0.1,
});

server.set('case sensitive routing', true);
server.set('env', config.env);
server.disable('x-powered-by');

export const redis = new Redis(config.redis);

server.use(helmet({
	referrerPolicy: false
}))

server.use(Sentry.Handlers.requestHandler());
server.use(Sentry.Handlers.tracingHandler());

server.all('/:code([a-zA-Z0-9_-]{10})', controller);

server.use('/check', (req, res, next) => {
	console.log('Instance identity ping');
	return next();
});

server.all('*', (req, res) => {
	res.json({message: 'Welcome to the Hermes Gateway'})
});

server.use(Sentry.Handlers.errorHandler());

server.listen(config.port, () => {
	console.log(`Hermes Gateway online at port ${config.port} in ${config.env.toLowerCase()} mode`);
})