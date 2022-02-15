require("dotenv").config();
const express = require("express");
const tasks = require('./routes/tasks');
const connectDB = require("./connect");
const { User, Data } = require("./model/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_STRING = "kfkjfkjfdkjakdjferuej#$#$#2u3@#@$@kfj";
const app = express();
const PORT = 4000;

app.use(express.static("./client"));
app.use(express.json());
app.use('/api/v1/tasks', tasks);
app.post("/api/register", async (req, res) => {
  const { username, password: plainPassword, jobtype, buildingnumber, buildingname, phonenumber, officenumber} = req.body;
  //console.log(await bcrypt.hash(password, 5));
  if (!username) {
    return res.json({
      status: "error",
      error: "Invalid username/ no username",
    });
  }
  if (!plainPassword) {
    return res.json({
      status: "error",
      error: "Invalid password",
    });
  }
  const password = await bcrypt.hash(plainPassword, 5);
  try {
    const user = await User.create({ username, password, jobtype, buildingname, buildingnumber, phonenumber, officenumber});
    console.log(user);
    res.json(user);
  } catch (error) {
    //JSON.stringify(error);
    if (error.code === 11000) {
      console.log(error);
      return res.json({ status: "error", error: "username already in use" });
    }
    throw error;
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.log(error);
    return res.json({ status: "error" });
  }
});
app.get("/api/users/:id", async (req, res) => {
  
  //const { id: user } = req.params;
  console.log(req.params)
  const { id: token } = req.params
 const user = jwt.verify(token, JWT_STRING);
  console.log(user)
  const uid = user._id.toString();
  try {
    const singleUser = await User.findOne({ _id: uid });
    res.json(singleUser);
  } catch (error) {
    console.log(error);
    return res.json({ status: "error" });
  }
});
app.get("/api/users_Task/:id", async (req, res) => {
  
  const { id: user } = req.params;
  //console.log(req.params)
  //const { id: token } = req.params
 //const user = jwt.verify(token, JWT_STRING);
 // console.log(user)
  //const uid = user._id
  try {
    const singleUser = await User.findOne({ _id: user });
    res.json(singleUser);
  } catch (error) {
    console.log(error);
    return res.json({ status: "error" });
  }
});
app.delete("/api/users/:id", async (req, res) => {
  const { id: user } = req.params;
  try {
    const singleUser = await User.findOneAndDelete({ _id: user });
    res.json(singleUser);
  } catch (error) {
    console.log(error);
    return res.json({ status: "error" });
  }
});
//authenticaion
app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const user = await User.findOne({ username });
    console.log(user)
    if (!user) {
      return res.json({ status: "error", error: "invalid username/password" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          _id: user._id,
          username,
        },
        JWT_STRING
      );
     return res.json({status : "ok", user, data: token})
    //return res.json({ status: "ok", data: token });
    }
    res.json({ status: "error", error: "invalid username/password" });
  } catch (error) {
    console.log(error);
    //return res.json({ status: error });
  }
});
app.use("/api/users/change-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = jwt.verify(token, JWT_STRING);
    // console.log(user);
    const newPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: newPassword },
      }
    );
    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
  }
});
app.post("/api/user-specific-data", async (req, res) => {
  const {
    token,
    data: { hobby, club },
  } = req.body;
  const user = jwt.verify(token, JWT_STRING);
  //console.log(user);
  try {
    const userID = user._id;
    await Data.create({ userID, hobby, club });
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: error, error: "unkown" });
  }
});
app.post("/api/get-user-profile", async (req, res) => {
  const { token } = req.body;
  const user = jwt.verify(token, JWT_STRING);
  if (!user) {
    return res.json({ status: "error", error: "authentication failed" });
  }
  const id = user._id;
  try {
    const data = await Data.find({ userID: id });
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});



const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server is listening at port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
