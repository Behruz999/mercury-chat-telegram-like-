const EntityImageModel = require("../models/entityImageModel");

module.exports = {
  addOne: async function (req, res, next) {
    try {
      await EntityImageModel.create(req.body);
      return res.status(201).json({ entityImage: "success" });
    } catch (err) {
      console.log(err, "- error on creating entityImage");
      return res.status(500).json({ entityImage: err.entityImage || err });
    }
  },

  getAll: async function (req, res, next) {
    try {
      const docs = await EntityImageModel.find();
      return res.status(200).json(docs);
    } catch (err) {
      console.log(err, "- error on getting all entityImages");
      return res.status(500).json({ entityImage: err.entityImage || err });
    }
  },

  getOne: async function (req, res, next) {
    try {
      const doc = await EntityImageModel.findById(req.params?.id);

      if (doc === null) {
        return res.status(404).json({ entityImage: "Not found" });
      }

      return res.status(200).json(doc);
    } catch (err) {
      console.log(err, "- error on getting all entityImages");
      return res.status(500).json({ entityImage: err.entityImage || err });
    }
  },

  editOne: async function (req, res, next) {
    try {
      const doc = await EntityImageModel.findByIdAndUpdate(
        req.params?.id,
        req.body,
        {
          new: true,
        }
      );

      if (doc === null) {
        return res.status(404).json({ entityImage: "Not found" });
      }

      return res.status(200).json(doc);
    } catch (err) {
      console.log(err, "- error on getting all entityImages");
      return res.status(500).json({ entityImage: err.entityImage || err });
    }
  },

  deleteOne: async function (req, res, next) {
    try {
      const doc = await EntityImageModel.findByIdAndDelete(req.params?.id);

      if (doc === null) {
        return res.status(404).json({ entityImage: "Not found" });
      }

      return res.status(204).json({ entityImage: "success" });
    } catch (err) {
      console.log(err, "- error on getting all entityImages");
      return res.status(500).json({ entityImage: err.entityImage || err });
    }
  },
};
