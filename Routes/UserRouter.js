import express from "express";
import {
  getAllPrograms,
  GetLatestWinningTeam,
  GetTotalPrograms,
  getWinningProgramAndStudents,
  GetWinningStudents,
  getWinningStudentsByTeam,
} from "../Controllers/Admin/UserController.js";
const userRouter = express();

userRouter.get("/get-winnig-studets", GetWinningStudents);
userRouter.get("/get-total-programs", GetTotalPrograms);
userRouter.get("/get-winning-teams", GetLatestWinningTeam);
userRouter.get("/get-all-programs", getAllPrograms);
userRouter.get("/get-winnigstudent-eachteams", getWinningStudentsByTeam);
userRouter.get("/get-program-winnigstudent", getWinningProgramAndStudents);

export default userRouter;
