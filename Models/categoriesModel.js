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
      }
})

const Category = mongoose.model('Category',categorySchema);
export default Category;