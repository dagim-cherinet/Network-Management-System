const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, 
    required: true,
  },
  jobtype: {
    type:String,
    required: true
  },
  buildingname :{
    type:String,

  },
  buildingnumber :{
    type:String,

  },
  officenumber: {
type: String
  },
  phonenumber: {
    type: String,
    // required: true
  },
email: {
  type: String
}

});
const HistorySchema = new mongoose.Schema({
  work_done: {
    type: String
  },

date_of_workdone: {
  type: Date
}
})

const TaskSchema = new mongoose.Schema({
  userID: String,
  task_name: String
})
//const Task = mongoose.model("Task", TaskSchema)
const History = mongoose.model("History", HistorySchema)

const User = mongoose.model("User", userSchema);

//module.exports = mongoose.model("user", userSchema);
module.exports = { User, History};
