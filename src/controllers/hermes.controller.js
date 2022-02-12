import http from 'http';

import {redis} from '../../main';

import config from '../../config';

export default async (req, res, next) => {
	const code = req.params.code;
	let redirected = false;

	const request = JSON.stringify({
		referrer: req.get('Referrer') || null,
		userAgent: req.get('User-Agent'),
		clientHints: [
			req.get('sec-ch-ua'),
			req.get('sec-ch-ua-mobile'),
			req.get('sec-ch-ua-platform')
		],
		ipAddress: req.get('cf-connecting-ip') || req.socket.remoteAddress,
		timestamp: new Date(),
		country: req.get('cf-ipcountry') || null,
	})

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(request)
		}
	}

	const cached = await redis.get(`link__code_${code}`);

	if (cached) {
		res.redirect(302, cached)
		redirected = true;
	}

	const hermes = await new Promise((resolve, reject) => {
		const req = http.request(`${config.hermes}/links/${code}/click`, options, (res) => {
			let data = [];

			res.on('data', (chunk) => { data += chunk; })
			res.on('end', () => { resolve(JSON.parse(data)); });
		});

		req.on('error', (err) => { reject(err); });

		req.write(request);

		req.end();
	});

	if (!redirected) {
		switch (hermes.statusCode) {
			case 200:
				res.redirect(302, hermes.data.node.target);
				redis.set(`link__code_${code}`, hermes.data.node.target, 'EX', config.cacheTime);
				break;

			case 404:
				res.redirect(302, config.defaultRedirect);
				if (cached) redis.del(`link__code_${code}`);
				break;
		}
	}
}