const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
      required: true,
    },
    desc: {
      type: String,
      default: null,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_public: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const groupModel = mongoose.model("Group", groupSchema);

module.exports = groupModel;
