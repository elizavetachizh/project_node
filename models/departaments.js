const mongoose = require("mongoose");

const DepartamentsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  idMen: {
    type: String,
  },
});

const Departament = mongoose.model("Departament", DepartamentsSchema);

module.exports = Departament;
