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

const TEAM_SET = new Set(["GROUP-A", "GROUP-B", "GROUP-C"]);

const AddUser = async (req, res) => {
  try {
    const {
      email,
      name,
      chessNumber,
      categories = [],
      programs = [],
      team,
      points = 0,
    } = req.body;

    if (
      !email ||
      !name ||
      categories.length === 0 ||
      programs.length === 0 ||
      !team
    ) {
      return res.status(400).json({
        success: false,
        message:
          "name, email, categories (array), programs (array), and team are required",
      });
    }

    if (!TEAM_SET.has(team)) {
      return res.status(400).json({ success: false, message: "Invalid team" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { chessNumber }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or chess number already exists",
      });
    }

    // Validate all categories exist
    const categoryDocs = await Category.find({ _id: { $in: categories } });
    if (categoryDocs.length !== categories.length) {
      return res
        .status(404)
        .json({ success: false, message: "One or more categories not found" });
    }

    // Validate programs belong to selected categories
    const programDocs = await Program.find({ _id: { $in: programs } });
    const invalid = programDocs.find(
      (p) => !categories.includes(String(p.category))
    );
    if (invalid) {
      return res.status(400).json({
        success: false,
        message: "One or more programs do not belong to selected categories",
      });
    }

    const user = await User.create({
      name,
      email,
      chessNumber,
      categories, // store array
      programs,
      team,
      points,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res
      .status(400)
      .json({
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
    const {
      name,
      email,
      categories = [],
      programs = [],
      points,
      team,
      chessNumber,
    } = req.body;

    // Uniqueness check
    const existingUser = await User.findOne({
      _id: { $ne: id },
      $or: [{ email }, { chessNumber }],
    });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "Another user with same email or chess number exists",
      });

    // Validate all categories exist
    if (categories.length > 0) {
      const categoryDocs = await Category.find({ _id: { $in: categories } });
      if (categoryDocs.length !== categories.length)
        return res
          .status(400)
          .json({ success: false, message: "Some categories are invalid" });
    }

    // Validate programs
    if (programs.length > 0) {
      const validPrograms = await Program.find({ _id: { $in: programs } });
      if (validPrograms.length !== programs.length)
        return res
          .status(400)
          .json({ success: false, message: "Some programs are invalid" });
    }

    const updateData = {
      name,
      email,
      categories, 
      programs,
      points,
      team,
      chessNumber,
    };

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res
      .status(200)
      .json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({
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
      .populate("programs")
      .populate("categories")
      // .exec();
      .sort({ createdAt: -1 });

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
      .populate("categories"); // optional: populate related fields

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
  getPrograms,
};

// /*======================================== ADMIN AUTHENTICATION CONTROLLER ======================================== */
