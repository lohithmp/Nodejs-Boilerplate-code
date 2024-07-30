import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import toJSON from './plugins/toJsonPlugin.js';
import paginate from './plugins/paginatePlugin.js';

import APIError from '../utils/apiError.js';
import Role from './roleModel.js';
import httpStatus from 'http-status';

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		userName: {
			type: String,
			required: true,
			unique: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			private: true
		},
		avatar: {
			type: String,
			default: 'avatar.png'
		},
		confirmed: {
			type: Boolean,
			default: false
		},
		roles: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'roles'
			}
		]
	},
	{
		timestamps: true,
		toJSON: { virtuals: true }
	}
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

class UserClass {
	static async isUserNameAlreadyExists(userName, excludeUserId) {
		return !!(await this.findOne({ userName, _id: { $ne: excludeUserId } }));
	}

	static async isEmailAlreadyExists(email, excludeUserId) {
		return !!(await this.findOne({ email, _id: { $ne: excludeUserId } }));
	}

	static async getUserById(id) {
		return await this.findById(id);
	}

	static async getUserByUserName(userName) {
		return await this.findOne({ userName });
	}

	static async createUser(body) {
		if (await this.isUserNameAlreadyExists(body.userName)) {
			throw new APIError('User name already exists', httpStatus.BAD_REQUEST);
		}
		if (await this.isEmailAlreadyExists(body.email)) {
			throw new APIError('Email already exists', httpStatus.BAD_REQUEST);
		}
		if (body.roles) {
			await Promise.all(
				body.roles.map(async (rid) => {
					if (!(await Role.findById(rid))) {
						throw new APIError('Roles not exist', httpStatus.BAD_REQUEST);
					}
				})
			);
		}
		return await this.create(body);
	}


	async isPasswordMatch(password) {
		return bcrypt.compareSync(password, this.password);
	}
}

userSchema.loadClass(UserClass);

userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		const passwordGenSalt = bcrypt.genSaltSync(10);
		this.password = bcrypt.hashSync(this.password, passwordGenSalt);
	}
	next();
});

const User = mongoose.model('users', userSchema);

export default User;
