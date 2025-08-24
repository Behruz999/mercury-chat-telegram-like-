const mongoose = require("mongoose");

const entityImageSchema = new mongoose.Schema(
  {
    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    }, // User, group, or channel ID
    entity_type: {
      type: Number,
      required: true,
    }, // 1 > profile picture, 2 > group pc., 3 > channel pc.
    picture_url: {
      type: String,
      required: true,
    }, // URL of the image in external storage
    uploaded_at: {
      type: Date,
      default: Date.now,
    },
    is_current: {
      type: Boolean,
      default: true,
    }, // Indicates the active image for this entity
  },
  { versionKey: false, timestamps: true }
);

const entityImageModel = mongoose.model("EntityImage", entityImageSchema);

module.exports = entityImageModel;
