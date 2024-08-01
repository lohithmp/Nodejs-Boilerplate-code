import httpStatus from 'http-status';
import APIError from '../utils/apiError.js';
import ResizeImage from '../utils/resizeImage.js';

export const uploadImage = async (req, res) => {
	if (!req.file) {
		throw new APIError('Please provide an image', httpStatus.BAD_REQUEST);
	}
	const fileName = await ResizeImage(req.file.destination, req.file.filename);
	return res.json({ image: fileName });
};

export default { uploadImage };
