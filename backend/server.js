const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));

// DB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
