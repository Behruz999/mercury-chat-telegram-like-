const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    message_type: {
      type: String,
      index: true,
      default: "text",
      enum: [
        "text",
        "photo",
        "video",
        "audio",
        "document",
        "gif",
        "sticker",
        "pinned",
        "joined",
        "left",
        "removed",
        "promoted",
        "demoted",
        "created",
        "renamed",
        "forwarded",
        "reply",
        "mention",
        "reaction",
        "notification",
        "shared_location",
        "shared_contact",
        "shared_file",
        "invite_link",
        "deleted",
      ],
    },
    text: {
      type: String,
      index: true,
    }, // message text
    media_urls: {
      type: Array,
      default: [],
    }, // videos, files, ...
    replied_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    forwarded_from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    }, // forwarded message data
    shared_location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    reaction_counts: {
      type: Map,
      of: Number,
      default: {},
    }, // example: { '😊': 10, '👍': 5, '❤️': 8 }
    is_edited: {
      type: Boolean,
      default: false,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    // is_delivered: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { versionKey: false, timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
