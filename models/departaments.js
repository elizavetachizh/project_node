const mongoose = require("mongoose");

const DepartamentsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  nameMen: {
    type: String,
  },
  chief: {
    type: String,
  },
  description: {
    type: String,
  },
  schedule: {
    type: String,
  },
  contacts: {
    type: String,
  },
});

const Departament = mongoose.model("Departament", DepartamentsSchema);

module.exports = Departament;
