
import moment from 'moment';
import Token from '../models/tokenModel.js';
import jwtService from '../services/jwtService.js';

export const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add('30', 'minutes');
	const accessToken = await jwtService.sign(user.id, accessTokenExpires, 'secret_key', {
		algorithm: 'RS256'
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