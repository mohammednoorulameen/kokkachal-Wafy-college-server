import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.admin = decoded; // save decoded info
    next();
  });
};
