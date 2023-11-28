const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mailSender = require("../config/mailSender");
const Token = require("../models/tokenModel");

const registerUser = async (req, res) => {
  const { user, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(200)
      .send({ success: false, msg: "User already registered" });
  } else {
    try {
      const newEntry = new User({
        user,
        email,
        password,
      });
      await newEntry.save();
      await mailSender(newEntry, "verify-mail");
      return res.status(200).send({
        success: true,
        msg: "Registration successful and a verification mail has been send to your emial",
      });
    } catch (error) {
      return res.status(400).send({ success: false, msg: error });
    }
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.checkPassword(password))) {
      if (user.isVerified) {
        const tokenData = {
          _id: user._id,
          email: user.email,
          user: user.user,
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
          expiresIn: "30d",
        });

        return res
          .status(200)
          .send({ success: true, msg: "Login Successful", token: token });
      } else {
        return res.send({
          success: false,
          msg: "Email not verified,Please check your inbox",
        });
      }
    } else {
      return res.send({ success: false, msg: "User Not found" });
    }
  } catch (error) {
    return res.send(error);
  }
};
const userData = async (req, res) => {
  try {
    res.status(200).send({ success: true, data: req.body.user });
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateUser = async (req, res) => {
  const { updateUser } = req.body;
  const email = updateUser.email;

  const user = await User.findOne({ email });
  if (user && (await user.checkPassword(updateUser.cupassword))) {
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(updateUser.password, salt);
    await User.findByIdAndUpdate(
      user._id,
      {
        name: updateUser.name,
        email: updateUser.email,
        password: hashPassword,
      },
      (err) => {
        if (err) {
          return res.status(400).send({ msg: "Something went wrong" });
        } else {
          return res
            .status(200)
            .send({ success: true, msg: "Password updated successfully" });
        }
      }
    );
  } else {
    return res.send({ msg: "No user or something went wrong" });
  }
};

const verifyMail = async (req, res) => {
  try {
    const tokenDetail = await Token.findOne({ token: req.body.token });
    if (tokenDetail) {
      await User.findOneAndUpdate({
        _id: tokenDetail.userid,
        isVerified: true,
      });
      await Token.findOneAndDelete({ token: req.body.token });
      res.send({ success: true, msg: "Email verified successfully" });
    } else {
      res.send({ success: false, msg: "Invalid token" });
    }
  } catch (error) {
    res.send({ success: false, msg: "Invalid token" });
  }
};

module.exports = { registerUser, loginUser, userData, updateUser, verifyMail };
