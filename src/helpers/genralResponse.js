const { StatusCodes } = require("http-status-codes");
const MessageConstant = require("../constant/messageConstant");

class GeneralResponse {
  constructor(res, data, statusCode, status, message, errors = null) {
    this.data = data;
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;

    if (res) {
      const response = {
        data: data,
        status: {
          status: status,
          statusCode: statusCode,
          description: message,
        },
      };
      if (errors) {
        response.errors = errors;
      }
      res.status(statusCode).json(response);
    }
  }

  // 200 OK
  static success(res, data = null, message = MessageConstant.SUCCESS) {
    return new GeneralResponse(res, data, StatusCodes.OK, "SUCCESS", message);
  }

  // 200 OK
  static updated(res, data = null, message = MessageConstant.UPDATED) {
    return new GeneralResponse(res, data, StatusCodes.OK, "UPDATED", message);
  }

  // 201 Created
  static created(res, data = null, message = MessageConstant.CREATED) {
    return new GeneralResponse(
      res,
      data,
      StatusCodes.CREATED,
      "CREATED",
      message,
    );
  }

  // 400 Bad Request
  static badRequest(
    res,
    message = MessageConstant.BAD_REQUEST_ERROR,
    errors = null,
  ) {
    return new GeneralResponse(
      res,
      null,
      StatusCodes.BAD_REQUEST,
      "BAD_REQUEST",
      message,
      errors,
    );
  }

  // 404 Not Found
  static notFound(res, message = MessageConstant.NOT_FOUND) {
    return new GeneralResponse(
      res,
      null,
      StatusCodes.NOT_FOUND,
      "NOT_FOUND",
      message,
    );
  }

  // 500 Internal Server Error
  static serverError(res, message = MessageConstant.INTERNAL_SERVER_ERROR) {
    return new GeneralResponse(
      res,
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "INTERNAL_SERVER_ERROR",
      message,
    );
  }

  //401 Unauthorized Error
  static UnauthorizeResponse(res, message = MessageConstant.UNAUTHORIZED) {
    return new GeneralResponse(
      res,
      null,
      StatusCodes.UNAUTHORIZED,
      "UNAUTHORIZED",

      message,
    );
  }
}

module.exports = GeneralResponse;
