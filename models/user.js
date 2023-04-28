const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        required: true

    },
    userType: {
        type: String,
        required: true
    },
    walletBalance: {
        type: Number,
        required: true
    }

}, {
    timestamps: true
});




userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;