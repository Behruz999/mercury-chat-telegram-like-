const mongoose = require("mongoose");

const readStatusSchema = new mongoose.Schema(
  {
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    read_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true }
);

const readStatusModel = mongoose.model("ReadStatus", readStatusSchema);

module.exports = readStatusModel;
