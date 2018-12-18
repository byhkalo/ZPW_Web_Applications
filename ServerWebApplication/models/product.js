var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductsSchema = new Schema(
  {
    id: String,
    name: String,
    description: String,
    category: String,
    count: Number,
    price: Number,
    imageUrl: String,
    promotionId: String,
  }
);


//Export model
module.exports = mongoose.model('Product', ProductsSchema);