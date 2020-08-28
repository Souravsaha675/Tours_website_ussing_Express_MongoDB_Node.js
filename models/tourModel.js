const mongoose = require('mongoose');
const slugify = require('slugify');

const tourschema = new mongoose.Schema(
  {
    name: {
      type: 'string',
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true
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
      required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
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
    startDates: [Date]
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
