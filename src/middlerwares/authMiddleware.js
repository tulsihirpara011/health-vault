const jwt = require("jsonwebtoken");
const MessageConstants = require("../constant/MessageConstant");
const { eq } = require("drizzle-orm");
const { InvalidRequestException } = require("../excptions/ApiError");
const messageConstant = require("../constant/MessageConstant");
const { db } = require("../config/db");
const { session } = require("../models/session");
const JwtUtils = require("../utils/jwtUtils");

class AuthMiddleware {
  async auth(req, res, next) {
    try {
      const token = req.headers?.authorization.split(" ")[1];
      if (!token) {
        throw new InvalidRequestException(messageConstant.INVALID_TOKEN);
      }
      //decode token
      const decoded = JwtUtils.checkValidateToken(token);
      req.user= decoded
      const [Session] = await db
        .select()
        .from(session)
        .where(eq(session.id, decoded.session))
        .limit(1);
      //vaidate session
      if (!Session || !Session.isActive || Session.logoutTime) {
        throw new InvalidRequestException(messageConstant.INVALID_SESSIONID);
      }
      //  user/session request
      req.session = Session;
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      if (error.name === "TokenExpiredError") {
        try {
          const decoded = jwt.decode(token); // decode without verify

          if (decoded?.sessionId) {
            await db
              .update(session)
              .set({ isActive: false })
              .where(eq(session.id, decoded.sessionId));
          }
        } catch (dbError) {
          console.error("Session update error:", dbError);
        }
      }
    }
  }
}
module.exports = new AuthMiddleware();
