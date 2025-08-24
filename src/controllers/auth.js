const UserModel = require("../models/userModel");
const env = process.env;
const JWT = require("jsonwebtoken");
const { getRandomColor } = require("../utils/usefulFunction");

module.exports = {
  signIn: async function (req, res, next) {
    try {
      if (req.body.phone) {
        req.body.phone = req.body.phone.trim();
      }
      let user = await UserModel.findOne({
        phone: req.body.phone,
      }).select("_id password");

      if (!user) {
        user = new UserModel({
          phone: req.body.phone,
          accent_color: getRandomColor(),
        });
        await user.save();
      }

      let response = {
        message: `Successfully accessed Mercury-Chat !`,
        doc: user._id,
        status: 0, // 0 > no password, 1 > password confirm required
      };

      if (user.password) {
        if (!req.body.password) {
          response.status = 1;
          delete response.doc;
          delete response.message;
          return res.status(400).json(response);
        } else if (req.body.password != user.password) {
          return res
            .status(400)
            .json({ message: `Matching password required !` });
        }
      }

      const newToken = JWT.sign(
        { _id: user?._id, date: Date.now() },
        env?.JWT_SECRET_KEY,
        {
          expiresIn: env?.JWT_EXPIRES_IN,
        }
      );

      response.token = newToken;

      return res.status(200).json(response);
    } catch (err) {
      if (err?.code == 11000) {
        return res.status(400).json({ message: `Try another phone !` });
      }
      next(err);
    }
  },

  adminSignIn: async function (req, res, next) {
    const { login, password } = req.body;
    try {
    } catch (err) {
      return res.status(500).json({ message: err?.message || err });
    }
  },
};
