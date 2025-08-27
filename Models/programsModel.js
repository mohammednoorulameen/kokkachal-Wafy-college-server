import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    programName: {
      type: String,
      required: [true, "Program name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
  },
  {
    timestamps: true, 
  }
);

const Program = mongoose.model("Program", programSchema);

export default Program;



// import mongoose from 'mongoose'

// const programSchema = mongoose.Schema({
//     programName: { 
//         type: String,
//          required: true
//          },
//   description: {
//      type: String
//      },
//   category: {
//      type: mongoose.Schema.Types.ObjectId,
//       ref: "Category"
//      },
// })

// const Program = mongoose.model('Program',programSchema);
// export default Program