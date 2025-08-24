const UserModel = require("../models/userModel");
const { getRandomColor } = require("../utils/usefulFunction");

module.exports = {
  addOne: async function (req, res, next) {
    try {
      req.body.accent_color = getRandomColor();
      await UserModel.create(req.body);
      return res.status(201).json({ message: "success" });
    } catch (err) {
      console.log(err, "- error on creating user");
      return res.status(500).json({ message: err.message || err });
    }
  },

  getAll: async function (req, res, next) {
    try {
      const docs = await UserModel.find().exec();
      return res.status(200).json(docs);
    } catch (err) {
      console.log(err, "- error on getting all users");
      return res.status(500).json({ message: err.message || err });
    }
  },

  getOne: async function (req, res, next) {
    try {
      const doc = await UserModel.findById(req.params?.id).exec();

      if (doc === null) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(200).json(doc);
    } catch (err) {
      console.log(err, "- error on getting all users");
      return res.status(500).json({ message: err.message || err });
    }
  },

  editOne: async function (req, res, next) {
    try {
      const doc = await UserModel.findByIdAndUpdate(req.params?.id, req.body, {
        new: true,
      }).exec();

      if (doc === null) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(200).json(doc);
    } catch (err) {
      console.log(err, "- error on getting all users");
      return res.status(500).json({ message: err.message || err });
    }
  },

  deleteOne: async function (req, res, next) {
    try {
      const doc = await UserModel.findByIdAndDelete(req.params?.id).exec();
      if (doc === null) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(200).json({ message: "success" });
    } catch (err) {
      console.log(err, "- error on getting all users");
      return res.status(500).json({ message: err.message || err });
    }
  },
};
