const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    contact_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    custom_name: {
      type: String,
      default: null,
    },
    added_at: {
      type: Date,
      default: Date.now,
    }, // added to contacts list timestamp
    is_blocked: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const contactModel = mongoose.model("Contact", contactSchema);

module.exports = contactModel;
