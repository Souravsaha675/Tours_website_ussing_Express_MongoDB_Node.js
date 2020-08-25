const mongoose = require('mongoose');

const tourschema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'A tour must have a name'],
    unique: true
  }
});

const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
