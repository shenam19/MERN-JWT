const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    if (con) {
      console.log("Connect to DB");
    } else {
      console.log("Unable to connect to DB.Try Again!");
    }
  } catch (error) {
    console.error(error);
    process.exit();
  }
};
module.exports = connectDb;
