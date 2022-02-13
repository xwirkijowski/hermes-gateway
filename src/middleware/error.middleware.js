import config from '../../config';

export default (err, req, res, next) => {
	err.statusCode ??= 500;
	err.status ??= 'Internal Server Error';

	console.log('Error:', err.statusCode, err.message)

	if (err.statusCode === 500) delete err.message;

	res.status(err.statusCode).json({
		statusCode: err.statusCode,
		status: err.status,
		message: err.message || undefined,
		...((config.env === 'DEVELOPMENT') ? { trace: err.trace } : undefined),
		errorId: res.sentry
	});
}