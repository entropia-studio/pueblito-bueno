const express = require('express');

const {
  getSpots,
  getSpotsFromLocation,
  getSpot,
  createSpot,
  updateSpot,
  deleteSpot,
} = require('../controllers/spots');

const router = express.Router();

router.route('/')
  .get(getSpots)
  .post(createSpot);

router.route('/fromlocation')
  .get(getSpotsFromLocation);

router.route('/:id')
  .get(getSpot)
  .put(updateSpot)
  .delete(deleteSpot);



module.exports = router;
