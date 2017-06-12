let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcryptjs')

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
    sis: String,
    coordX: String,
    coordY: String

});

UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('sis')) return next();

    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.sis, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.sis = hash;
            next();
        });
    });
});

module.exports = mongoose.model('user', UserSchema);