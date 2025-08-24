const ReadStatusModel = require("../models/readStatusModel");

module.exports = {
  addOne: async function (req, res, next) {
    try {
      await ReadStatusModel.create(req.body);
      return res.status(201).json({ message: "success" });
    } catch (err) {
      console.log(err, "- error on creating readStatus");
      return res.status(500).json({ message: err.message || err });
    }
  },

  getAll: async function (req, res, next) {
    try {
      const docs = await ReadStatusModel.find();
      return res.status(200).json(docs);
    } catch (err) {
      console.log(err, "- error on getting all readStatuss");
      return res.status(500).json({ message: err.message || err });
    }
  },

  getOne: async function (req, res, next) {
    try {
      const doc = await ReadStatusModel.findById(req.params?.id);

      if (doc === null) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(200).json(doc);
    } catch (err) {
      console.log(err, "- error on getting all readStatuss");
      return res.status(500).json({ message: err.message || err });
    }
  },

  editOne: async function (req, res, next) {
    try {
      const doc = await ReadStatusModel.findByIdAndUpdate(
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
      console.log(err, "- error on getting all readStatuss");
      return res.status(500).json({ message: err.message || err });
    }
  },

  deleteOne: async function (req, res, next) {
    try {
      const doc = await ReadStatusModel.findByIdAndDelete(req.params?.id);

      if (doc === null) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(204).json({ message: "success" });
    } catch (err) {
      console.log(err, "- error on getting all readStatuss");
      return res.status(500).json({ message: err.message || err });
    }
  },
};
