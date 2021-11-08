const AppError = require(`${__dirname}/../utils/appError`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);
exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const tour = await Model.findByIdAndDelete(req.params.id);

		if (!tour) {
			return new AppError('Not found document in Database', 400);
		}
		res.status(204).json({
			status: 'success',
		});
	});

exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);
		res.status(200).json({
			status: 'success',
			data: doc,
		});
	});

exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) {
			return next(AppError('Not found document in Database', 404));
		}
		res.status(200).json({
			status: 'success',
			data: doc,
		});
	});

exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (popOptions) query = query.populate(popOptions);
		const doc = await query;

		if (!doc) {
			return next(new AppError('Not found document in Database', 404));
		}
		res.status(200).json({
			status: 200,
			data: {
				doc,
			},
		});
	});

exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		const features = new APIFeatures(Model.find(), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();
		const doc = await features.query;
		// 		console.log(features.query);

		// RESPONSE
		res.status(200).json({
			status: 200,
			result: doc.length,
			data: {
				doc,
			},
		});
	});
