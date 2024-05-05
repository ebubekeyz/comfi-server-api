const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');

const registerUser = async (req, res) => {
  const { identifier, name, password } = req.body;
  let role;
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const isSecondAccount = (await User.countDocuments({})) === 1;

  if (isFirstAccount) {
    role = 'admin';
  } else if (isSecondAccount) {
    role = 'owner';
  } else {
    role = 'user';
  }
  const user = await User.create({ role, identifier, name, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: user, token: token });
};

const loginUser = async (req, res) => {
  console.log(req.body);
  const { identifier, password } = req.body;
  if (!identifier) {
    throw new BadRequestError('Please provide an email');
  }
  if (!password) {
    throw new BadRequestError('Please provide a password');
  }
  const user = await User.findOne({ identifier });
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Password did not match');
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: user, token: token });
};
const getAllUsers = async (req, res) => {
  let { sort, name, identifier } = req.query;

  let result = User.find({});

  if (name) {
    result = User.find({ name: { $regex: name, $options: 'i' } });
  }

  if (identifier) {
    result = User.find({
      identifier: { $regex: identifier, $options: 'i' },
    });
  }

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('name');
  }
  if (sort === 'z-a') {
    result = result.sort('-name');
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const users = await result;

  const totalUsers = await User.countDocuments();
  const numOfPage = Math.ceil(totalUsers / limit);

  res.status(StatusCodes.OK).json({
    users: users,
    meta: {
      pagination: { page: page, total: totalUsers, pageCount: numOfPage },
    },
  });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ user: user });
};

const editSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ user: user });
};

const deleteSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findByIdAndDelete({ _id: userId });
  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: 'User Deleted' });
};

const deleteAllUsers = async (req, res) => {
  const user = await User.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'Users Deleted' });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
module.exports = {
  showCurrentUser,
  registerUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  editSingleUser,
  deleteSingleUser,
  deleteAllUsers,
};
