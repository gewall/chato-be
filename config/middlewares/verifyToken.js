const jwt = require("jsonwebtoken");
var createError = require("http-errors");

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.headers["authorization"] ||
      req.cookies["access-token"] ||
      req.headers["x-access-token"];

    const verify = jwt.verify(token, process.env.SECRET_KEY);

    if (!verify)
      return res
        .status(401)
        .json({ status: "error", pesan: "Token kadaluarsa!" });

    next();
  } catch (error) {
    next(createError(401, error));
  }
};

module.exports = verifyToken;
