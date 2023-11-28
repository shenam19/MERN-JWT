const express = require("express");
const connectDb = require("./config/db");
const authRoute = require("./routes/authRoute");
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 5500;

connectDb();
app.use("/auth", authRoute);
// app.get("/", (req, res) => {
//   res.send("Home page");
// });
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
