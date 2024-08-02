import passport from 'passport';
import httpStatus from 'http-status';
import APIError from '../utils/apiError.js';
import Role from '../models/roleModel.js';

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
	if (err || info || !user) {
        console.log('Error:', err);
        console.log('Info:', info);
        console.log('User:', user);
		return reject(new APIError(httpStatus[httpStatus.UNAUTHORIZED], httpStatus.UNAUTHORIZED));
	}
	req.user = user;
	if (requiredRights.length) {
		const userRights = [];
		console.log("user.roles:", user.roles);
		const roles = await Role.find({ _id: { $in: user.roles } }).populate('permissions');
		console.log({roles});
		roles.forEach((i) => {
			i.permissions.forEach((j) => {
				userRights.push(`${j.controller}:${j.action}`);
			});
		});
		const hasRequiredRights = requiredRights.every((r) => userRights.includes(r));
		console.log('requiredRights: ', requiredRights);
		console.log('userRights: ', userRights);
		console.log('boolean: ', hasRequiredRights);
		if (!hasRequiredRights) {
			return reject(new APIError('Resource access denied', httpStatus.FORBIDDEN));
		}
	}
	return resolve();
};

const authenticate = (...requiredRights) =>
	async (req, res, next) => {
        console.log('Authorization Header:', req.headers.authorization);
		return new Promise((resolve, reject) => {
			passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
		}).then(() => next()).catch((err) => next(err));
	};

export default authenticate;