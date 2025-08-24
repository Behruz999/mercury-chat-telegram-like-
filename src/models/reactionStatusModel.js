const mongoose = require("mongoose");

const reactionStatusSchema = new mongoose.Schema(
  {
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    emoji: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const reactionStatusModel = mongoose.model(
  "ReactionStatus",
  reactionStatusSchema
);

module.exports = reactionStatusModel;
