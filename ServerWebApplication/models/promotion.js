var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PromotionsSchema = new Schema(
  {
    id: {type: String, required: true, max: 100},
    discount: {type: Number, required: true},
    untilTimestamp: {type: Number, required: true},
  }
);


//Export model
module.exports = mongoose.model('Promotion', PromotionsSchema);