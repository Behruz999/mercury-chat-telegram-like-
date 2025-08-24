const mongoose = require("mongoose");

const chatMemberSchema = new mongoose.Schema(
  {
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // join_date: {
    //   type: Date,
    //   default: Date.now,
    // }, // timestamp of user joined whether group or channel
    is_admin: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const chatMemberModel = mongoose.model("ChatMember", chatMemberSchema);

module.exports = chatMemberModel;
