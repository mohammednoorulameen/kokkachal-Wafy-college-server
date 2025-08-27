import { Timestamp } from "firebase-admin/firestore";
import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
        category: {
            type:String,
            required : true,
            unique: true
        },
      description: {
        type:String,
        required: true
      },
      status: {
        type: Boolean,
        default:true
      },

},
  { timestamps: true }
)

const Category = mongoose.model('Category',categorySchema);
export default Category;