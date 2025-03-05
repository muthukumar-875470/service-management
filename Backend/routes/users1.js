const express = require("express");
const multer = require("multer");
const path = require("path");
const Restaurant = require("../models/RestaurantsUser"); // Make sure this matches your model filename

const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

// ✅ Add a New Restaurant (POST) with image upload
router.post("/", upload.single('image'), async (req, res) => {
  try {
    const { name, location, cuisine, menu, description } = req.body;
    const image = req.file ? req.file.filename : null; 

    // Check if restaurant already exists
    const existingRestaurant = await Restaurant.findOne({ name });
    if (existingRestaurant) {
      return res.status(400).json({ error: "Service already exists" });
    }

    // Save new restaurant
    const newRestaurant = new Restaurant({ name, location, cuisine, menu, description, image });
    await newRestaurant.save();

    res.status(201).json({ message: "service added successfully", restaurant: newRestaurant });
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ error: "Server error, try again!" });
  }
});

// ✅ Get All Restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ error: "Failed to fetch service" });
  }
});

// ✅ Get a Single Restaurant by ID
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "service not found" });

    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update a Restaurant
router.put("/:id", async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedRestaurant) return res.status(404).json({ error: "service not found" });

    res.status(200).json({ message: "service updated successfully", restaurant: updatedRestaurant });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete a Restaurant
router.delete("/:id", async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) return res.status(404).json({ error: "service not found" });

    res.status(200).json({ message: "service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
