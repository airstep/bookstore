let mongoose = require('mongoose')
let Schema = mongoose.Schema;
let bcrypt = require('bcryptjs')
let passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new Schema({
    dogName: {
        type: String,
        required: true
    },
    gender: String,
    age: String,
    ownerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    coordX: String,
    coordY: String
});

// Passport-Local Mongoose will add a username, hash and salt field 
// to store the username, the hashed password and the salt value.
UserSchema.plugin(passportLocalMongoose, { saltlen: 10, saltField: 'sis', usernameField: 'email' });

module.exports = mongoose.model('user', UserSchema);