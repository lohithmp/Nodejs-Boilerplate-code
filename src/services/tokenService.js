
import moment from 'moment';
import Token from '../models/tokenModel.js';
import jwtService from '../services/jwtService.js';
import crypto from 'crypto';
import User from '../models/userModel.js';

export const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add('30', 'minutes');
	const accessToken = await jwtService.sign(user.id, accessTokenExpires, 'your_secret_key', {
		algorithm: 'HS256'
	});

	const refreshTokenExpires = moment().add('1', 'days');
	const refreshToken = await generateRandomToken();
	await Token.saveToken(refreshToken, user.id, refreshTokenExpires.format(), 'refresh');

	return {
		accessToken: {
			token: accessToken,
			expires: accessTokenExpires.format()
		},
		refreshToken: {
			token: refreshToken,
			expires: refreshTokenExpires.format()
		}
	};
};

export const generateRandomToken = async (length = 66) => {
	const random = crypto.randomBytes(length).toString('hex');
	return random;
};

export const verifyToken = async (token, type) => {
	console.log("TOKEN___>", token);
	const tokenDoc = await Token.findOne({ token, type, blacklisted: false });
	console.log("-tokenDoc-",tokenDoc);
	if (!tokenDoc) {
		throw new APIError('Token not found', httpStatus.UNAUTHORIZED);
	}
	if (moment(tokenDoc.expiresAt).format() < moment().format()) {
		throw new APIError('Token expires', httpStatus.UNAUTHORIZED);
	}
	return tokenDoc;
};

export const generateResetPasswordToken = async (email) => {
	const user = await User.getUserByEmail(email);
	if (!user) {
		throw new APIError('No users found with this email', httpStatus.NOT_FOUND);
	}
	const expires = moment().add('2000', 'minutes');
	const resetPasswordToken = await generateRandomToken();
	await Token.saveToken(resetPasswordToken, user.id, expires, 'resetPassword');
	return resetPasswordToken;
};