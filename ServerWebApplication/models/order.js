var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrdersSchema = new Schema(
  {
    id: {type: String, required: true, max: 100},
    clientFirstName: {type: String, required: true, max: 100},
    clientLastName: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    telephone: {type: String, required: true, max: 100},
    addres: {type: String, required: true, max: 100},
    city: {type: String, required: true, max: 100},
    state: {type: String, required: true, max: 100},
    postalCode: {type: String, required: true, max: 100},
    shipingType: {type: String, required: true, max: 100},
    category: {type: String, required: true, max: 100},
    products: {id: String,
                name: String,
                description: String,
                category: String,
                count: Number,
                price: Number,
                imageUrl: String,
                promotionId: String,},
    completness: [boolean],
    totalSum: Number,
  }
);


//Export model
module.exports = mongoose.model('Order', OrdersSchema);