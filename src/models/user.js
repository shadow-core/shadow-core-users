import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: 'String',
        unique: true,
        required: true,
        trim: true,
        index: true,
    },
    password_hash: { type: 'String', required: true },
    isEmailVerified: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    verificationCode: {
        type: mongoose.Schema.Types.String,
    },
    verificationResendAmount: {
        type: mongoose.Schema.Types.Number,
        default: 0,
    },
    verificationResendRequestDate: {
        type: mongoose.Schema.Types.Date
    },
    registrationDate: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
    },
    resetPasswordIsRequested: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
    resetPasswordRequestDate: {
        type: mongoose.Schema.Types.Date,
    },
    resetPasswordToken: {
        type: mongoose.Schema.Types.String
    },
    resetPasswordRequestsAmount: {
        type: mongoose.Schema.Types.Number,
        default: 0,
    },
    isAdmin: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
    isDeleted: { //never delete data, only mark it as deleted!
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
}, {
    collection: 'users'
});

userSchema.methods.checkEmailVerified = function () {
    let diff_time = Date.now() - this.registrationDate.getTime();
    let max_diff_time = 7 * 24 * 3600 * 1000;
    if (diff_time > max_diff_time &&
        this.isEmailVerified === false) {
        return false;
    }
    return true;
}

userSchema.statics.findByEmail = function(email, cb) {
    return this.findOne({'email': email, 'isDeleted': { $ne: true }}, cb);
};

userSchema.statics.findById = function(id, cb) {
    return this.findOne({_id: id}, cb);
};

export default mongoose.model('UserModel', userSchema);