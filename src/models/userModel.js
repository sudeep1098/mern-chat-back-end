import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import bcrypt from 'bcryptjs';

dotenv.config();

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      max: 25,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.generateAccessJWT = function () {
  const token = jwt.sign({ id: this._id }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1h' });
  return token;
};

const User = mongoose.model("User", UserSchema);

export default User;
