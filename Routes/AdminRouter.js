import express from "express";
const adminRouter = express();
import {
  AddCategory,
  AddPoints,
  AddProgram,
  AddUser,
  DefaultAdmin,
  getAllCheckingStudents,
  getCategories,
  getPrograms,
  GetUsers,
  toggleProgramStatus,

  UpdateProgram,

  UpdateUser,
} from "../Controllers/Admin/AdminController.js";
// import { verifyAdmin } from "../Middlewares/VerifyAdmin.js";

// GET

adminRouter.get("/admin-get-users", GetUsers);
adminRouter.get("/admin-get-categories", getCategories);
adminRouter.get("/admin-get-programs", getPrograms);
adminRouter.get("/admin-get-checking-student", getAllCheckingStudents);

// POST

adminRouter.post("/adminlogin", DefaultAdmin);
adminRouter.post("/adduser", AddUser);
adminRouter.post("/addcategory", AddCategory);
adminRouter.post("/addprogram", AddProgram);

// UPDATE

adminRouter.put("/admin-update/:id/points", AddPoints);
adminRouter.put("/admin-edit-user/:id", UpdateUser);
adminRouter.put("/admin-edit-prgram/:programId", UpdateProgram);
adminRouter.put("/adminchange-user-status/:studentId/:programId", toggleProgramStatus);

export default adminRouter;

// import express from "express";
// const adminRouter = express();
// import {
//   AdminLogin,
//   UserList,
//   BlockUser,
//   AddCategory,
//   getCategory,
//   BlockCategory,
//   EditCategory,
// } from "../Controllers/Admin/AdminController.js";
// import {
//   AddProduct,
//   ListProduct,
//   BlockProduct,
//   EditProduct,
//   GetEditProduct,
// } from "../Controllers/Admin/ProductController.js";

// /*
// GET
// */

// adminRouter.get("/adminuserslist", UserList);
// adminRouter.get("/admingetcategory", getCategory);
// adminRouter.get("/adminlist-Products", ListProduct);
// adminRouter.get("/get-edit-product", GetEditProduct);

// /*
// POST
// */

// adminRouter.post("/adminlogin", AdminLogin);
// adminRouter.post("/adminblockuser", BlockUser);
// adminRouter.post("/adminaddcategory", AddCategory);
// adminRouter.post("/adminblockcategory", BlockCategory);
// adminRouter.post("/adminadd-product", AddProduct);
// adminRouter.post("/admin-block-product", BlockProduct);

// /*
// PUT
// */

// adminRouter.put("/admineditcategory", EditCategory);
// adminRouter.put("/admin-edit-product", EditProduct);

// export default adminRouter;
