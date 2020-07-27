const mongoose = require("mongoose");

const challengeSchema = mongoose.Schema({
    challengeDescription: {
        type: String,
        required: true
    }
});

const Challenge = mongoose.model("Challenge", challengeSchema);
module.exports = Challenge;