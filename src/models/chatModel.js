const mongoose = require("mongoose");
const { generateHash } = require("../utils/usefulFunction");

const chatSchema = new mongoose.Schema(
  {
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    channel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
    chat_type: {
      type: String,
      index: true,
      default: "private",
      enum: ["private", "group", "channel"],
    },
    chat_hash: {
      type: String,
      unique: true,
      default: generateHash, // Auto-generate hash
    },
    participant_ids: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    }, // users id ( only available for chat_type: 1 (private) )
  },
  { versionKey: false, timestamps: true }
);

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;
