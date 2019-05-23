import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
    default: false,
  },
  verificationCode: {
    type: mongoose.Schema.Types.String,
  },
  verificationResendAmount: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  verificationResendRequestDate: {
    type: mongoose.Schema.Types.Date,
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
    type: mongoose.Schema.Types.String,
  },
  resetPasswordRequestsAmount: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  isAdmin: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  isDeleted: { // never delete data, only mark it as deleted!
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
}, {
  collection: 'users',
  autoCreate: true,
});

UserSchema.methods.checkEmailVerified = () => {
  const diffTime = Date.now() - this.registrationDate.getTime();
  const maxDiffTime = 7 * 24 * 3600 * 1000;
  if (diffTime > maxDiffTime
        && this.isEmailVerified === false) {
    return false;
  }
  return true;
};

UserSchema.statics.findByEmail = (email, cb) => {
  return this.findOne({ email, isDeleted: { $ne: true } }, cb).exec();
};

UserSchema.statics.findById = (id, cb) => {
  return this.findOne({ _id: id }, cb);
};

export default UserSchema;
