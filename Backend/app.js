// app.js (or server1.js)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

// Import the router for restaurants
const restaurantRouter = require('./routes/users1');
// Import the Restaurant model
const Restaurant = require('./models/RestaurantsUser'); 

// Import routers for user authentication and handling
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const port = process.env.PORT || 4001; // Use environment variable or fallback to 4001

// Middleware for CORS
app.use(cors());

// Middleware for logging HTTP requests
app.use(logger('dev'));

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware to parse JSON and handle URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files (images) from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB using MONGO_URI from the .env file
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurantdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Use the restaurant router for API routes
app.use('/api/restaurants', restaurantRouter);

// Routes for user authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);

// POST Route to add a new restaurant



// PUT Route to update a restaurant
app.put('/api/restaurants/:id', async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // This ensures that the updated document is returned
    );
    
    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(updatedRestaurant);
  } catch (err) {
    console.error('Error updating restaurant:', err);
    res.status(500).json({ message: 'Failed to update restaurant' });
  }
});

// DELETE Route to delete a restaurant
app.delete('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json({ message: "Restaurant deleted" });
  } catch (err) {
    console.error('Error deleting restaurant:', err);
    res.status(500).json({ message: 'Failed to delete restaurant' });
  }
});

// Search Route for restaurants
app.get('/api/restaurants/search', async (req, res) => {
  const { query, district } = req.query; // Get query and district from the request

  let searchConditions = {};

  if (query) {
    searchConditions.$or = [
      { name: { $regex: query, $options: 'i' } },
      { cuisine: { $regex: query, $options: 'i' } },
      { location: { $regex: query, $options: 'i' } },
    ];
  }

  if (district) {
    searchConditions.location = { $regex: district, $options: 'i' };
  }

  try {
    const results = await Restaurant.find(searchConditions);
    res.json(results);
  } catch (err) {
    console.error('Error during search:', err);
    res.status(500).json({ message: 'Failed to search restaurants' });
  }
});

// Global error handling for uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Exit with failure code
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1); // Exit with failure code
});

// Catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Export the app instance
module.exports = app;
