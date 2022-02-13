import {getReasonPhrase} from 'http-status-codes';

export default class HermesError extends Error {
	constructor(statusCode = 500, message = undefined, trace = undefined) {
		super(message);

		this.statusCode = statusCode;
		this.status = getReasonPhrase(statusCode);
		this.message = message;
		this.trace = trace;
	}
}