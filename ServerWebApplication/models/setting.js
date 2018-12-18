var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SettingsSchema = new Schema(
  {
    serverTypeFirebase: Boolean,
  }
);


//Export model
module.exports = mongoose.model('Setting', SettingsSchema);