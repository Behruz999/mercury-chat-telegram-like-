const crypto = require("crypto");

// Array of predefined colors (Telegram-inspired)
const telegramColors = [
  "#0088CC", // Primary Blue
  "#008080", // Teal
  "#800080", // Purple
  "#FF69B4", // Pink
  "#FFA500", // Orange
  "#008000", // Green
  "#DC3545", // Error Red
  "#FFC107", // Warning Yellow
  "#2962FF", // Link Blue
];

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * telegramColors.length);
  return telegramColors[randomIndex];
}

function generateHash() {
  return crypto.randomBytes(16).toString("hex"); // 32-character hex string
}

async function updateAndReturnIds(filter, update, model) {
  const matchingDocs = await model.find(filter, { _id: 1 });
  const updatedIds = matchingDocs.map((doc) => doc?._id?.toString());

  await model.updateMany(filter, update);

  return updatedIds;
}

module.exports = { getRandomColor, generateHash, updateAndReturnIds };
