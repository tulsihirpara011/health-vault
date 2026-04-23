const messageConstant = {
  //upload document messages
  FILE_UPLOADED_SUCCESSFULLY: "File uploaded successfully",
  ERROR_UPLODED_FILE: "Error uploading file",
  FILE_SIZE_ERROR: "File size exceeds 25MB limit",
  INVALID_FILE_TYPE: "Invalid file type. Only PDF, DOCX, and TXT are allowed",
  FILE_KEY_REQUIRED: "File key is required to get download URL",
  FILE_DOWNLOAD_URL_GENERATED: "File download URL generated successfully",
  ERROR_GENERATING_DOWNLOAD_URL: "Error generating download URL",

  //general messages
  SUCCESS: "Success",
  USER_CREATED: "User created successfully",
  USER_UPDATE: "User updated successfully",
  USER_DELETE: "User deleted successfully",
  BAD_REQUEST_ERROR: "Bad request. Please check your input and try again.",
  ERROR: "Error",
  SERVER_ERROR: "Internal server error. Please try again later.",
  UNAUTHORIZED_ERROR: "Unauthorized. Please provide valid credentials.",
  OK_RESPONSE: "OK",
  USER_NOT_FOUND: "User not found",
  EMAIL_EXISTING: "Email already exists",
};

module.exports = messageConstant;
