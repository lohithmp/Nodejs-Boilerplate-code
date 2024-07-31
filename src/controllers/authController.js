import APIError from '../utils/apiError.js';
import {generateAuthTokens, verifyToken } from '../services/tokenService.js';
import User from '../models/userModel.js';
import httpStatus from 'http-status';
import Role from '../models/roleModel.js';
import Token from '../models/tokenModel.js';

const signup = async (req, res) => {
	const role = await Role.getRoleByName('User');
	req.body.roles = [role.id];
	const user = await User.createUser(req.body);
	const tokens = await generateAuthTokens(user);
	console.log("--signup-----", user,"token- ", tokens );
	return res.json({
		success: true,
		data: { user, tokens }
	});
};

const signin = async (req, res) => {
	const user = await User.getUserByUserName(req.body.userName);
	console.log("user",user);
	if (!user || !(await user.isPasswordMatch(req.body.password))) {
		throw new APIError('Incorrect user name or password', httpStatus.BAD_REQUEST);
	}
	const tokens = await generateAuthTokens(user);
	console.log("--signin-----", user,"token- ", tokens );

	return res.json({
		success: true,
		data: { user, tokens }
	});
};

const signout = async (req, res) => {
	await Token.revokeToken(req.body.refreshToken, 'refresh');
	return res.json({
		success: true,
		data: 'Signout success'
	});
};

const refreshTokens = async (req, res) => {
	try {
		const refreshTokenDoc = await verifyToken(req.body.refreshToken, 'refresh');
		const user = await User.getUserById(refreshTokenDoc.user);
		console.log("user-->", user, "refreshTokenDoc", refreshTokenDoc);
		if (!user && !refreshTokenDoc) {
			throw new Error();
		}
		await Token.deleteOne({ _id: refreshTokenDoc._id });

		const tokens = await generateAuthTokens(user);
		console.log("tokens->", tokens);
		return res.json({
			success: true,
			data: {
				tokens
			}
		});
	} catch (err) {
		throw new APIError(err.message, httpStatus.UNAUTHORIZED);
	}
};

export const getMe = async (req, res) => {
	const user = await User.getUserByIdWithRoles(req.user.id);
	if (!user) {
		throw new APIError('User not found', httpStatus.NOT_FOUND);
	}
	return res.json({
		success: true,
		data: user
	});
};


export default {
	signup,
	signin,
	signout,
	refreshTokens,
	getMe
};
