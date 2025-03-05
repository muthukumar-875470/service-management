const mongoose = require("mongoose");

// Define the Restaurant schema
const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensure each restaurant name is unique
    },
    location: {
      type: String,
      required: true,
    },
    menu: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: { type: String }, // Store image URL
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
