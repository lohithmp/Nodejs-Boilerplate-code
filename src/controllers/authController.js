import APIError from '../utils/apiError.js';
import { generateAuthTokens, verifyToken, generateResetPasswordToken } from '../services/tokenService.js';
import User from '../models/userModel.js';
import httpStatus from 'http-status';
import Role from '../models/roleModel.js';
import Token from '../models/tokenModel.js';
import { sendResetPasswordEmail } from '../services/emailService/index.js';

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

export const forgotPassword = async (req, res) => {
	const resetPasswordToken = await generateResetPasswordToken(req.body.email);
	await sendResetPasswordEmail(req.body.email, resetPasswordToken);
	return res.json({
		success: true,
		data: 'Send forgot password email success'
	});
};

export const resetPassword = async (req, res) => {
	try {
		const resetPasswordTokenDoc = await verifyToken(req.query.token, 'resetPassword');
		const user = await User.getUserById(resetPasswordTokenDoc.user);
		console.log("reset password ==>", user);
		if (!user) {
			throw new Error();
		}
		await Token.deleteMany({ user: user.id, type: 'resetPassword' });
		await User.updateUserById(user.id, { password: req.body.password });
		return res.json({
			success: true,
			data: 'Reset password success'
		});
	} catch (err) {
		throw new APIError('Password reset failed', httpStatus.UNAUTHORIZED);
	}
};

export const updateMe = async (req, res) => {
	console.log(req.user.id, req.body);
	const user = await User.updateUserById(req.user.id, req.body);
	return res.json({
		success: true,
		data: user
	});
};

export const deleteMe = async (req, res) => {
	const data =  await User.findByIdAndDelete(req.user.id);

	return res.json({
		success: true,
		data: {
			message: "deleted successfully!",
			data: data
		}
	});
};

export default {
	signup,
	signin,
	signout,
	refreshTokens,
	getMe,
	forgotPassword,
	resetPassword,
	updateMe,
	deleteMe
};
