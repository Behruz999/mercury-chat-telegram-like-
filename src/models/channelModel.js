const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
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
    creator_id: {
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

const channelModel = mongoose.model("Channel", channelSchema);

module.exports = channelModel;
