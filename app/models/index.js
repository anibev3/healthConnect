const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.appointment = require("./appointment.model");
db.carnet = require("./carnet.model");

db.ROLES = ["patient", "assistant", "chief_medecin"];

module.exports = db;
