const isValidObjectID = require("mongoose").Types.ObjectId.isValid;

function checkValidObjectId(request, response, next) {
  const valid = isValidObjectID(request.params?.id);
  if (valid) {
    return next();
  }

  return response.status(400).json({ message: "Invalid identifier" });
}

module.exports = { checkValidObjectId };
