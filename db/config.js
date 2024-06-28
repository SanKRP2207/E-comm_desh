const mongoose = require('mongoose');
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI ? process.env.MONGO_URI.toString() : '';


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
  
  module.exports = mongoose;
