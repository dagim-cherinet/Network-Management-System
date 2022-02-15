const Task = require("../models/Task");
const jwt = require("jsonwebtoken");
const JWT_STRING = "kfkjfkjfdkjakdjferuej#$#$#2u3@#@$@kfj";
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");
const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ tasks });
});

const createTask = asyncWrapper(async (req, res) => {
  const { task, token } = req.body;
  const user = jwt.verify(token, JWT_STRING);
  const userID = user._id;

  const newTask = await Task.create({ userID, ...req.body });
  console.log(newTask);
  res.status(201).json({ newTask });
});

const getTask = asyncWrapper(async (req, res, next) => {
  // const token = req.params;
  const { id: token } = req.params;
  const user = jwt.verify(token, JWT_STRING);

  const uid = user._id.toString();
  console.log(uid);
  //const { id: taskID } = req.params
  const task = await Task.find({ userID: uid });
  console.log(task);
  // console.log(task)
  if (!task) {
    return next(createCustomError(`No task with id : ${uid}`, 404));
  }

  res.status(200).json({ task });
});
const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskID });
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }
  res.status(200).json({ task });
});
const updateTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;

  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }

  res.status(200).json({ task });
});

const AcceptTask = asyncWrapper(async (req, res, next) => {
  const { accept: taskID } = req.params;

  const task = await Task.findOneAndUpdate({ userID: taskID }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404));
  }

  res.status(200).json({ task });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  AcceptTask,
};
