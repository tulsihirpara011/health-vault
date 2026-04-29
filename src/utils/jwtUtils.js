const jwt = require("jsonwebtoken");
const {
  InvalidRequestException,
  UnauthorizedException,
} = require("../excptions/ApiError");
const messageConstant = require("../constant/MessageConstant");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIREIN = "7d";
const FORGOT_PASSWORD_EXPIRE = process.env.FORGOT_PASSWORD_EXPIRE;

module.exports = class JwtUtils {
  static generateToken = (payload) => {
    console.log("payload in generateToken:", payload);
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIREIN });
  };

  //forgot passwored token
  static generateForgotPasswordToken(userId) {
    return jwt.sign(
      {
        userId,
        accessType: "FORGOT_PASSWORD",
      },
      SECRET_KEY,
      { expiresIn: FORGOT_PASSWORD_EXPIRE },
    );
  }

  static verifyToken(token) {
    if (!token) {
      throw new InvalidRequestException(messageConstant.INVALID_TOKEN);
    }
    //verify token
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new UnauthorizedException(messageConstant.INVALID_TOKEN);
      }
      throw new UnauthorizedException(messageConstant.INVALID_TOKEN);
    }
  }
  static checkValidateToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
  };

  static checkExpireToken = (token) => {};
};
