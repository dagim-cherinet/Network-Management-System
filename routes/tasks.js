const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  editTask,
  AcceptTask,
} = require("../controllers/tasks");

router.route("/").get(getAllTasks).post(createTask);
router.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);
router.route("/accept/:accept").patch(AcceptTask);
router.route("/edit/:id").get(async (req, res, next) => {
  // const token = req.params;
  const { id } = req.params;

  //const { id: taskID } = req.params
  const task = await Task.findOne({ _id: id });
  console.log(task);
  // console.log(task)
  if (!task) {
    return next(createCustomError(`No task with id : ${uid}`, 404));
  }

  res.status(200).json({ task });
});

module.exports = router;
