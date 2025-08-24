const ChatMemberModel = require("../models/chatMemberModel");

module.exports = {
  addOne: async function (req, res, next) {
    try {
      await ChatMemberModel.create(req.body);
      return res.status(201).json({ message: "success" });
    } catch (err) {
      console.log(err, "- error on creating chatMember");
      return res.status(500).json({ message: err.message || err });
    }
  },

  getAll: async function (req, res, next) {
    try {
      const docs = await ChatMemberModel.find();
      return res.status(200).json(docs);
    } catch (err) {
      console.log(err, "- error on getting all chatMembers");
      return res.status(500).json({ message: err.message || err });
    }
  },

  getOne: async function (req, res, next) {
    try {
      const doc = await ChatMemberModel.findById(req.params?.id);

      if (doc === null) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(200).json(doc);
    } catch (err) {
      console.log(err, "- error on getting all chatMembers");
      return res.status(500).json({ message: err.message || err });
    }
  },

  editOne: async function (req, res, next) {
    try {
      const doc = await ChatMemberModel.findByIdAndUpdate(
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
      console.log(err, "- error on getting all chatMembers");
      return res.status(500).json({ message: err.message || err });
    }
  },

  deleteOne: async function (req, res, next) {
    try {
      const doc = await ChatMemberModel.findByIdAndDelete(req.params?.id);

      if (doc === null) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(204).json({ message: "success" });
    } catch (err) {
      console.log(err, "- error on getting all chatMembers");
      return res.status(500).json({ message: err.message || err });
    }
  },
};
