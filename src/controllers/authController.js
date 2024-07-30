import APIError from '../utils/apiError.js';
import {generateAuthTokens} from '../services/tokenService.js';
import User from '../models/userModel.js';
import httpStatus from 'http-status';
import Role from '../models/roleModel.js';

export const signup = async (req, res) => {
	const role = await Role.getRoleByName('User');
	req.body.roles = [role.id];
	const user = await User.createUser(req.body);
	const tokens = await generateAuthTokens(user);
	return res.json({
		success: true,
		data: { user, tokens }
	});
};

export const signin = async (req, res) => {
	const user = await User.getUserByUserName(req.body.userName);
	if (!user || !(await user.isPasswordMatch(req.body.password))) {
		throw new APIError('Incorrect user name or password', httpStatus.BAD_REQUEST);
	}
	const tokens = await generateAuthTokens(user);
	return res.json({
		success: true,
		data: { user, tokens }
	});
};



export default {
	signup,
	signin,
};
