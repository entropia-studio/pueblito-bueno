const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const LangCode = {
  type: String,
  enum: ['es', 'en', 'ca', 'eu', 'gl', 'fr', 'de'],
  require: [true, 'Please add a valid language'],
};

const SpotSchema = new mongoose.Schema({
  lang: [
    {
      code: LangCode,
      name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [255, 'Name cannot be more than 255 characters'],
      },
      description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true,
        minlength: [50, 'Description cannot be less than 50 characters'],
      },
      hintCover: {
        type: String,
        required: [true, 'Please add a hintCover'],
        trim: true,
        minlength: [10, 'hintCover cannot be less than 50 characters'],
      },
    },
  ],
  address: {
    type: String,
    required: [true, 'Please add an address'],
    trim: true,
    maxlength: [255, 'Address cannot be more than 255 characters'],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone cannot be more than 20 characters'],
  },
  url: {
    type: String,
    match: [
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
    ],
  },
  images: [
    {
      id: {
        type: String,
        trim: true,
        reqired: [true, 'Please add a valid id for the image'],
        lang: [
          {
            code: LangCode,
            description: {
              type: String,
              required: [true, 'Please add a description'],
              trim: true,
              minlength: [10, 'Description cannot be less than 10 characters'],
            },
          },
        ],
      },
    },
  ],
  category: {
    type: String,
    enum: ['recommended', 'lodging', 'restaurants', 'services'],
  },
  storagePath: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// SpotSchema.pre('save', async function (next) {
//   const lat = this.location.coordinates[0];
//   const lon = this.location.coordinates[1];
//   const loc = await geocoder.reverse({ lat, lon });
//   this.location = {
//     type: 'Point',
//     coordinates: [loc[0].longitude, loc[0].latitude],
//     formattedAddress: loc[0].formattedAddress,
//     street: loc[0].streetName,
//     city: loc[0].city,
//     state: loc[0].stateCode,
//     zipcode: loc[0].zipcode,
//     country: loc[0].countryCode,
//   };
//   // Do not save address in database
//   this.address = undefined;
//   next();
// });

module.exports = mongoose.model('Spot', SpotSchema);
