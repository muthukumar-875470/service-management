
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/users"); // Import user routes
const User = require("./models/userModels"); // ✅ Import User model

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/signup", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Use user routes
app.use("/api", userRoutes);

// ✅ Fetch Users Route (Fixed)
app.get("/api/login", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// ✅ Activate User Route (Fixed)
app.put("/api/activate/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User activated successfully", user });
  } catch (error) {
    console.error("❌ Failed to activate user:", error);
    res.status(500).json({ error: "Failed to activate user" });
  }
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});



// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));