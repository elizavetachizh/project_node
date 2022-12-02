const mongoose = require("mongoose");

const ManagementSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  idDepartment: {
    type: [],
  },
  department: {
    type: [],
  },
});

const Management = mongoose.model("Management", ManagementSchema);

module.exports = Management;
