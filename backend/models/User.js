const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    score: { type: String, default: "0" },
    questionNo: { type: String, default: "0" },
    currentState: { type: String, default: "start" },
    startTime: { type: Date },
    timeTaken: { type: Number, default: 0 },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date
});


UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
