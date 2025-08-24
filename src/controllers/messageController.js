const MessageModel = require("../models/messageModel");

module.exports = {
  addOne: async function (req, res, next) {
    try {
      await MessageModel.create(req.body);
      return res.status(201).json({ message: "success" });
    } catch (err) {
      console.log(err, "- error on creating message");
      return res.status(500).json({ message: err.message || err });
    }
  },

  getAll: async function (req, res, next) {
    try {
      const docs = await MessageModel.find();
      return res.status(200).json(docs);
    } catch (err) {
      console.log(err, "- error on getting all messages");
      return res.status(500).json({ message: err.message || err });
    }
  },

  getOne: async function (req, res, next) {
    try {
      const doc = await MessageModel.findById(req.params?.id);

      if (doc === null) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(200).json(doc);
    } catch (err) {
      console.log(err, "- error on getting all messages");
      return res.status(500).json({ message: err.message || err });
    }
  },

  editOne: async function (req, res, next) {
    try {
      const doc = await MessageModel.findByIdAndUpdate(
        req.params?.id,
        req.body,
        {
          new: true,
        }
      );

      if (doc === null) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(200).json(doc);
    } catch (err) {
      console.log(err, "- error on getting all messages");
      return res.status(500).json({ message: err.message || err });
    }
  },

  deleteOne: async function (req, res, next) {
    try {
      const doc = await MessageModel.findByIdAndDelete(req.params?.id);

      if (doc === null) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(204).json({ message: "success" });
    } catch (err) {
      console.log(err, "- error on getting all messages");
      return res.status(500).json({ message: err.message || err });
    }
  },
};
