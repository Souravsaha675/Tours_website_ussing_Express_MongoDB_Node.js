const mongoose = require('mongoose');
const slugify = require('slugify');
//const User = require('./userModel');
//const validator = require('validator');

const tourschema = new mongoose.Schema(
  {
    name: {
      type: 'string',
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minlength: [10, 'A tour name must be more or equal than 10 characters'],
      maxlength: [40, 'A tour name must be less or equal than 40 characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either : easy or medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(value) {
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) should be less than regular price'
      }
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a Cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

///////////VIRTUAL PROPERTIES//////////////////////////

tourschema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

///////////////DOCUMENT MIDDLEWARS////////////////////
tourschema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourschema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));

//   this.guides = await Promise.all(guidesPromises);

//   next();
// });
// tourschema.pre('save', function(next){
//   console.log("will save document");
//   next();
// })

// tourschema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

////////////////////QUERY MIDDLEWARE////////////////////////////////

tourschema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourschema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

tourschema.post(/^find/, function(doc, next) {
  // eslint-disable-next-line no-console
  console.log(`QUERY took ${Date.now() - this.start} milliseconds`);
  //console.log(docs);
  next();
});

/////////////AGGREGATION MIDDLEWARE///////////////////////

tourschema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  next();
});

const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
