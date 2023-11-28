const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const userSchema = new Schema(
  {
    user: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function () {
  const user = this;
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hashSync(user.password, salt);
});
userSchema.methods.checkPassword = async function (password) {
  try {
    // console.log(this);
    const user = await bcrypt.compare(password, this.password);
    return user;
  } catch (error) {
    console.error(error);
  }
};

// //Compare the password

// userSchema.methods.comparePassword = async function (password) {
//   try {
//     const user = await bcrypt.compare(password, this.password);
//     return user;
//   } catch (error) {
//     console.error(error);
//   }
// };

const User = mongoose.model("user", userSchema);
module.exports = User;
