const Spot = require('../models/Spot');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
// @desc    Get all spots
// @route   GET /api/v1/spots
// @access  Public
exports.getSpots = asyncHandler(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort'];
  // Remove properties over the reqQuery object
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(req.query);
  
  queryStr = queryStr.replace(/\b(in)\b/g, match => `$${match}`);
  query = Spot.find(JSON.parse(queryStr));
  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort by
  if (req.query.sort) {
    const sortBy = req.query.select.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = queri.sort('-createdAt');
  }
  
  const spots = await query;
  res
    .status(200)
    .json({ success: true, count: spots.length, data: spots });
 });
 
// @desc    Get all spots ordered by distance from my location
// @route   GET /api/v1/spots/fromLocation
// @access  Public
exports.getSpotsFromLocation = asyncHandler(async (req, res, next) => {
  const { lat, lon, category } = req.query;
  
  let geoNear = {
    near: { type: "Point", coordinates: [ +lon, +lat ] },
    distanceField: "dist.calculated",    
    includeLocs: "dist.location",
    spherical: true,    
  };
  if (category) {
    geoNear = { ...geoNear, query: { category }};
  }

  const spots = await Spot.aggregate([{ $geoNear: geoNear }]);

  if (!spots) {
    return next(new ErrorResponse(`Spots not found from your location`, 400));
  }
  res.status(200).json({success: true, count: spots.length, data: spots});

});


// @desc    Get single spot
// @route   GET /api/v1/spots/:id
// @access  Public
exports.getSpot = asyncHandler(async (req, res, next) => {
  const spot = await Spot.findById(req.params.id);
  if (!spot) {
    return next(
      new ErrorResponse(`Spot not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: spot });
});
// @desc    Create a new spot
// @route   POST /api/v1/spots
// @access  Private
exports.createSpot = asyncHandler(async (req, res, next) => {
  const spot = await Spot.create(req.body);
  res.status(201).json({ success: true, data: spot });
});
// @desc    Update spot
// @route   UPDATE /api/v1/spots/:id
// @access  Private
exports.updateSpot = asyncHandler(async (req, res, next) => {
  const spot = await Spot.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!spot) {
    return next(
      new ErrorResponse(`Spot not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: spot });
});
// @desc    Delete spot
// @route   DELETE /api/v1/spots/:id
// @access  Private
exports.deleteSpot = asyncHandler(async (req, res, next) => {
  const spot = await Spot.findByIdAndDelete(req.params.id);
  if (!spot) {
    return next(
      new ErrorResponse(`Spot not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: req.params.id });
});
