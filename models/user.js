const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const { saltRound, jwtSecret } = require("../config");

const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      minlength: [4, "Name is too short"],
      maxlength: [30, "Name is too long"],
      required: "Full-name is required",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, "This email is already registered"],
      required: [true, "Email address is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      minlength: [7, "too short"],
      maxlength: [30, "too long"],
      required: true,
    },
    sources: [String],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  return { ...user, password: undefined, __v: undefined };
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, Number(saltRound));
  }
  next();
});

userSchema.methods.checkPassword = async function (plainPassword) {
  const user = this;
  return bcrypt.compare(plainPassword, user.password);
};

userSchema.methods.generateToken = function () {
  const user = this;
  return jwtSign({ id: user.id }, jwtSecret, { expiresIn: "12h" });
};

userSchema.statics.getUserFromToken = async function (token) {
  try {
    const { id } = await jwtVerify(token, jwtSecret);
    return this.findById(id);
  } catch (error) {
    return null;
  }
};

userSchema.statics.findByCredentials = async function ({ email, password }) {
  const user = await this.findOne({ email });
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
};

module.exports = model("User", userSchema);
