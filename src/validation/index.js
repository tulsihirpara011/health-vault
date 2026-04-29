// const messageConstant = require("../constant/MessageConstant");
// const { success } = require("../helpers/genralResponse");
// const { patch } = require("../routes");

// async function zodValidateData(schema, data) {
//   try {
//     if (!schema || !data) {
//       return { success: false, error: messageConstant.INTERNAL_SERVER_ERROR };
//     }
//     const result = await schema.safeParseAsync(data);
//     if (!result.success) {
//       return {
//         success: false,
//         error: result.error.issues,
//       };
//     }
//     return {
//       success: true,
//       data: result.data,
//     };
//   } catch (errors) {
//     const issues = errors?.issues || [];
//     const error = issues?.[0] || {};
//     return {
//       success: false,
//       error: issues,
//     };
//   }
// }
// module.exports = zodValidateData;
const messageConstant = require("../constant/MessageConstant");

async function zodValidateData(schema, data) {
  try {
    if (!schema || !data) {
      return {
        success: false,
        error: [
          {
            field: "general",
            message: messageConstant.INTERNAL_SERVER_ERROR,
          },
        ],
      };
    }

    const result = await schema.safeParseAsync(data);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return {
        success: false,
        error: formattedErrors,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (err) {
    console.error("FULL ZOD ERROR:", err);
    return {
      success: false,
      error: [
        {
          field: "general",
          message: "Validation failed",
        },
      ],
    };
  }
}

module.exports = zodValidateData;
