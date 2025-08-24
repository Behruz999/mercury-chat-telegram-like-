const GroupModel = require("../models/groupModel");

module.exports = {
  addOne: async function (req, res, next) {
    try {
      await GroupModel.create(req.body);
      return res.status(201).json({ group: "success" });
    } catch (err) {
      console.log(err, "- error on creating group");
      return res.status(500).json({ group: err.group || err });
    }
  },

  getAll: async function (req, res, next) {
    try {
      const docs = await GroupModel.find();
      return res.status(200).json(docs);
    } catch (err) {
      console.log(err, "- error on getting all groups");
      return res.status(500).json({ group: err.group || err });
    }
  },

  getOne: async function (req, res, next) {
    try {
      const doc = await GroupModel.findById(req.params?.id);

      if (doc === null) {
        return res.status(404).json({ group: "Not found" });
      }

      return res.status(200).json(doc);
    } catch (err) {
      console.log(err, "- error on getting all groups");
      return res.status(500).json({ group: err.group || err });
    }
  },

  editOne: async function (req, res, next) {
    try {
      const doc = await GroupModel.findByIdAndUpdate(req.params?.id, req.body, {
        new: true,
      });

      if (doc === null) {
        return res.status(404).json({ group: "Not found" });
      }

      return res.status(200).json(doc);
    } catch (err) {
      console.log(err, "- error on getting all groups");
      return res.status(500).json({ group: err.group || err });
    }
  },

  deleteOne: async function (req, res, next) {
    try {
      const doc = await GroupModel.findByIdAndDelete(req.params?.id);

      if (doc === null) {
        return res.status(404).json({ group: "Not found" });
      }

      return res.status(204).json({ group: "success" });
    } catch (err) {
      console.log(err, "- error on getting all groups");
      return res.status(500).json({ group: err.group || err });
    }
  },
};
