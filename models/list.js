var mongoose =require("mongoose");

var listSchema = mongoose.Schema({
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
		},
		username: String,
        link: String
    }
});

module.exports = mongoose.model("List" , listSchema);