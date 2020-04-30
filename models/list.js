var mongoose =require("mongoose");

var listSchema = mongoose.Schema({
    username: String,
    link: String
});

module.exports = mongoose.model("List" , listSchema);