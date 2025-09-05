const mongoose = require("mongoose");

const DBConnection = () => {
  mongoose.connect(process.env.DB_URL).then((connect) => {
    console.log(`DB Connection with host ${connect.connection.host}`);
  });
};

module.exports = DBConnection;
