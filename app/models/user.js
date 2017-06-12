let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcryptjs')

var UserSchema = new Schema({
    dogName: { type: String, required: true },
    gender: String,
    age: String,
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    sis: String,
    coordX: String,
    coordY: String

});

UserSchema.pre('save', next => {
    bcrypt.genSalt(10, function (err,salt) {
        bcrypt.hash(this.sis, salt, function (err, hash) {
            this.sis = hash
            next();
        })
    })
});

module.exports = mongoose.model('user', UserSchema);