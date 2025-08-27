
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/*
create access token
*/

const AccessToken = (userId) => {
    return jwt.sign({userId} , process.env.ACCESS_TOKEN, {
      expiresIn: "3m",
    });
  };
  
  /*
  create a refresh token
  */
  
  const RefreshToken = (userId) => {
    return jwt.sign( {userId} , process.env.REFRESH_TOKEN, {
      expiresIn: "7d",
    });
  };
  
  export {
    AccessToken,
    RefreshToken
  }