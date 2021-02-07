const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

connectDB();

// Route files
const spots = require('./routes/spots');

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/spots', spots);

// Error handling
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on(`unhandledRejection`, (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
