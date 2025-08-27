// /*======================================== ADMIN AUTHENTICATION CONTROLLER ======================================== */

import jwt from "jsonwebtoken";
import User from "../../Models/userModel.js";
import Category from "../../Models/categoriesModel.js";
import Program from "../../Models/programsModel.js";

/**
 * default admin
 */

const DefaultAdmin = async (req, res) => {
  const { email, password } = req.body;
  console.log("check email and password", email, password);
  // default admin credentials
  const ADMIN_EMAIL = "admin@gmail.com";
  const ADMIN_PASSWORD = "kokkachal@123";

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // generate JWT
    const token = jwt.sign(
      { email, isAdmin: true },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Admin logged in successfully",
      isAdmin: true,
      token, // frontend will use this
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};

/**
 * add users
 */


const AddUser = async (req, res) => {
  try {
    const { email, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create and save user
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create user",
    });
  }
};

/**
 * upadate user
 */

const UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Check if email or name needs uniqueness check
    if (email || name) {
      const query = {
        _id: { $ne: id }, // exclude current user
        $or: [],
      };

      if (email) query.$or.push({ email });
      if (name) query.$or.push({ name });

      if (query.$or.length > 0) {
        const existingUser = await User.findOne(query);
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: `Another user with this ${existingUser.email === email ? 'email' : 'name'} already exists`,
          });
        }
      }
    }

    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true, // return updated document
      runValidators: true, // validate against schema
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update user",
    });
  }
};



/**
 * get users list
 */

const GetUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("programs") // populate full program details
      .populate("category") // populate full category details
      .exec();

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

/**
 * add category
 */

// Add Category Controller
const AddCategory = async (req, res) => {
  try {
    const { category, description } = req.body;

    // Validation
    if (!category || category.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (!description || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    // Check if category already exists (case insensitive)
    const existingCategory = await Category.findOne({
      category: { $regex: new RegExp(`^${category}$`, "i") },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Create new category
    const newCategory = new Category({
      category: category.trim(),
      description: description.trim(),
    });

    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create category",
    });
  }
};

/**
 * get category list
 */



const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,       
      data: categories,    
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/**
 * update points
 */

const AddPoints = async (req, res) => {
  try {
    const { points } = req.body;

    // Validate points
    if (points === undefined || points === null) {
      return res.status(400).json({
        success: false,
        message: "Points value is required",
      });
    }

    if (typeof points !== "number" || points <= 0) {
      return res.status(400).json({
        success: false,
        message: "Points must be a positive number",
      });
    }

    // Update user's points
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { points: points } },
      { new: true }
    )
      .populate("programs")
      .populate("category"); // optional: populate related fields

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `${points} points added successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Error adding points:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add points",
    });
  }
};

/**
 * add program
 */

const AddProgram = async (req, res) => {
  try {
    const { programName, description, category } = req.body;

    // Validation
    if (!programName) {
      return res.status(400).json({
        success: false,
        message: "Program name is required",
      });
    }
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Program category is required",
      });
    }

    // Check if program already exists
    const existingProgram = await Program.findOne({ programName });
    if (existingProgram) {
      return res.status(400).json({
        success: false,
        message: "Program already exists",
      });
    }

    // Create new program
    const newProgram = new Program({
      programName,
      description,
      category,
    });

    await newProgram.save();

    res.status(201).json({
      success: true,
      message: "Program created successfully",
      data: newProgram,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create program",
    });
  }
};

/**
 * get programs list
 */

// Get Programs
const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find()
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export {
  DefaultAdmin,
  AddUser,
  UpdateUser,
  GetUsers,
  AddCategory,
  AddProgram,
  AddPoints,
  getCategories,
  getPrograms
};

// /*======================================== ADMIN AUTHENTICATION CONTROLLER ======================================== */
