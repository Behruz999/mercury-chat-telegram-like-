const mongoose = require("mongoose");
const { getRandomColor } = require("../utils/usefulFunction");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      default: null,
    },
    last_name: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    bio: {
      type: String,
      default: null,
    },
    accent_color: {
      type: String,
      default: getRandomColor,
    },
    language_code: {
      type: String,
      default: "en",
    }, // Language code (e.g., 'en' for English)
    last_seen: {
      type: String,
      default: null, // Last seen timestamp (nullable)
    },
  },
  { versionKey: false, timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
