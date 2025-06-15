const mongoose = require('mongoose');

const connectDB = async() => {
  try {
    await mongoose.connect('mongodb://localhost:27017/VGK_tech', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (err) {
    process.exit(1);
  }
};

module.exports = connectDB;
