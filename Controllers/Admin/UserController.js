import User from "../../Models/userModel.js";
import Category from "../../Models/categoriesModel.js";
import Program from "../../Models/programsModel.js";

/**
 * Get Latest Winning Students
 */

//  const GetWinningStudents = async (req, res) => {
//   try {
//     // Fetch top 4 students sorted by points and creation date
//     const topStudents = await User.find({})
//       .sort({ points: -1, createdAt: -1 })
//       .limit(4)
//       .select('name team points chessNumber');

//     return res.status(200).json({
//       success: true,
//       data: topStudents,
//       message: 'Top 4 students fetched successfully',
//     });
//   } catch (error) {
//     console.error('Error fetching latest winning students:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch latest winning students',
//       error: error.message,
//     });
//   }
// };

const GetWinningStudents = async (req, res) => {
  try {
    const topStudents = await User.find({})
      .sort({ points: -1, createdAt: -1 })
      .limit(4)
      .select("name team points chessNumber")
      .lean();

    if (!topStudents.length) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    return res.status(200).json({
      success: true,
      data: topStudents,
      message: "Top 4 students fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching latest winning students:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest winning students",
      error: error.message,
    });
  }
};

/**
 * get total programs
 */

const GetTotalofPrograms = async (req, res) => {
  try {
    const totalPrograms = await Program.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        totalPrograms,
      },
      message: "Total programs fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching total programs:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch total programs",
      error: error.message,
    });
  }
};

/**
 * get latest winning team
 */
const GetLatestWinningTeam = async (req, res) => {
  try {
    const teams = await User.aggregate([
      {
        $group: {
          _id: "$team", // group by team name
          totalPoints: { $sum: "$points" }, // sum of points per team
          latestCreatedAt: { $max: "$createdAt" }, // latest member creation
          members: { $push: { name: "$name", points: "$points" } }, // store team members
        },
      },
      {
        $sort: { totalPoints: -1, latestCreatedAt: -1 }, // sort by totalPoints desc, then latestCreatedAt desc
      },
      {
        $project: {
          _id: 0,
          teamName: "$_id",
          totalPoints: 1,
          latestCreatedAt: 1,
          members: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: teams,
      message: "Latest winning teams fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching latest winning teams:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest winning teams",
      error: error.message,
    });
  }
};


/**
 * all programs
 */

// const getAllPrograms = async (req, res) => {
//   try {
//     const programs = await Program.find({}).sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       data: programs,
//       message: "Programs fetched successfully",
//     });
//   } catch (error) {
//     console.error("Error fetching programs:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch programs",
//       error: error.message,
//     });
//   }
// };


const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "category",       // field in Program that references Category
        select: "category -_id",    // only return the 'name' field
      });

    return res.status(200).json({
      success: true,
      data: programs,
      message: "Programs fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch programs",
      error: error.message,
    });
  }
};

/**
 * get winning studednts in each team
 */

const getWinningStudentsByTeam = async (req, res) => {
  try {
    const groups = await User.aggregate([
      // Sort by team ascending, then points descending
      { $sort: { team: 1, points: -1, createdAt: -1 } },

      // Group by team
      {
        $group: {
          _id: "$team",
          topStudents: {
            $push: {
              name: "$name",
              points: "$points",
              chessNumber: "$chessNumber",
            },
          },
        },
      },

      // Limit to top 3 students per team
      {
        $project: {
          team: "$_id",
          _id: 0,
          topStudents: { $slice: ["$topStudents", 3] },
        },
      },

      // Optional: sort teams alphabetically
      { $sort: { team: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: groups,
      message: "Top students by team fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching winning students by team:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch winning students by team",
      error: error.message,
    });
  }
};

/**
 * categoruzed programs
 * winning studend each program
 */


// const getWinningProgramAndStudents = async (req, res) => {
//   try {
//     // Step 1: Fetch all programs with their categories
//     const programs = await Program.find({})
//       .populate("category", "category") // only fetch category name
//       .lean();

//     // Step 2: Fetch top 4 students for each program
//     const results = await Promise.all(
//       programs.map(async (program) => {
//         const topStudents = await User.find({ programs: program._id })
//           .sort({ points: -1, createdAt: -1 }) // sort by points then by newest
//           .limit(4)
//           .select("name points team chessNumber"); // pick relevant fields

//         return {
//           programId: program._id,
//           programName: program.programName,
//           category: program.category?.category || "Uncategorized",
//           topStudents,
//         };
//       })
//     );

//     // Step 3: Group programs by category
//     const groupedByCategory = results.reduce((acc, program) => {
//       const cat = program.category;
//       if (!acc[cat]) acc[cat] = [];
//       acc[cat].push({
//         programId: program.programId,
//         programName: program.programName,
//         topStudents: program.topStudents,
//       });
//       return acc;
//     }, {});

//     return res.status(200).json({
//       success: true,
//       data: groupedByCategory,
//       message: "Programs with top students fetched successfully",
//     });
//   } catch (error) {
//     console.error("Error fetching programs and students:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch programs and top students",
//       error: error.message,
//     });
//   }
// };
const getWinningProgramAndStudents = async (req, res) => {
  try {
    const programs = await Program.find({})
      .populate("category", "category")
      .lean();

    const results = await Promise.all(
      programs.map(async (program) => {
        const topStudents = await User.find({
          programs: { $elemMatch: { programId: program._id, isActive: true } }
        })
          .sort({ points: -1, createdAt: -1 })
          .limit(4)
          .select("name points team chessNumber programs");

        const mappedStudents = topStudents.map((student) => {
          const activeProgram = student.programs.find(
            (p) => p.programId.toString() === program._id.toString() && p.isActive
          );

          if (!activeProgram) return null;

          return {
            _id: student._id,
            name: student.name,
            chessNumber: student.chessNumber,
            team: student.team,
            points: student.points,
            program: activeProgram,
          };
        }).filter(Boolean); // remove students without active program

        return {
          programId: program._id,
          programName: program.programName,
          category: program.category?.category || "Uncategorized",
          topStudents: mappedStudents,
        };
      })
    );

    const groupedByCategory = results.reduce((acc, program) => {
      const cat = program.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({
        programId: program.programId,
        programName: program.programName,
        topStudents: program.topStudents,
      });
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: groupedByCategory,
      message: "Programs with top students fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching programs and students:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch programs and top students",
      error: error.message,
    });
  }
};

export {
  GetWinningStudents,
  GetTotalofPrograms,
  GetLatestWinningTeam,
  getAllPrograms,
  getWinningStudentsByTeam,
  getWinningProgramAndStudents
};
