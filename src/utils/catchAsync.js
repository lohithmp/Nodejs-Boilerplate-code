const catchAsync = (fn) => (req, res, next) => {
	console.log("oooooooooooooooooooooo");
	Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;
