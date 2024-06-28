const mongoose = require('mongoose');
require("dotenv").config();

const mongoURI = process.env.DATABASE_URL;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
  
  module.exports = mongoose;
