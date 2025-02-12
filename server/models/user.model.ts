import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile_pic_url: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/graphic-designer-man_78370-159.jpg?t=st=1739293396~exp=1739296996~hmac=0eda4af7f370a3b56aad23887e4978981ad23503cf24086c93aa82171d935c92&w=996",
    },
    bio: {
      type: String,
      default: "Hey there! I am using Pulse.",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
