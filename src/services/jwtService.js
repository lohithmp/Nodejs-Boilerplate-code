import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import APIError from '../utils/apiError.js';

const sign = async (userId, expires, secret, options) => {
	try {
		const payload = {
			sub: userId,
			iat: moment().unix(),
			exp: expires.unix()
		};
		return jwt.sign(payload, secret, options);
	} catch (err) {
		throw new APIError(err.message, httpStatus.UNAUTHORIZED);
	}
};

export default { sign };
