const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    username : String,
    picture : String,
    nickname: String
}, {timestamps: true});

const Profile = mongoose.model('profile', ProfileSchema);

module.exports = Profile;