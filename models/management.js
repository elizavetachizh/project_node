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
  cardImg: {
    type: String,
  },
  name: {
      type: [{}]
  },
    department: {
        type: [Object]
    },
});

const Management = mongoose.model("Management", ManagementSchema);

module.exports = Management;
