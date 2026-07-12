const mongoose = require("mongoose");

function connectDB() {
    mongoose.connect(process.env.MONGO_URL)
        .then(function () {
            console.log("MongoDB Connected Successfully");
        })
        .catch(function (error) {
            console.log("Database Connection Failed");
            console.log(error);
        });
}

module.exports = connectDB;