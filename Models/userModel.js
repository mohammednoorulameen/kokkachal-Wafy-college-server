import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    chessNumber: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    categories: [
      {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "Category"
    },
  ],
    points: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    programs: [
      // {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "Program",
      // },
      {
      programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
      isActive: { type: Boolean, default: false },
      grade: { type: String,default: ""}
    }
      
    ],
    team: {
      type: String,
      enum: ["RADIANCE", "BRILLIANCE", "RESILIENCE"], 
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
