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
  passwordHash: { type: 'String', required: true },
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

UserSchema.methods = {
  /**
   * Check if email if verified.
   *
   * @todo should check this one too along with disabling verification.
   * @return {boolean}
   */
  checkEmailVerified() {
    const diffTime = Date.now() - this.registrationDate.getTime();
    const maxDiffTime = 7 * 24 * 3600 * 1000;
    if (diffTime > maxDiffTime
      && this.isEmailVerified === false) {
      return false;
    }
    return true;
  },

  /**
   * Check that user can request verification resend again
   *
   * @param {Object} config
   * @return {boolean}
   */
  checkVerificationRequestRule(config) {
    const checkTime = this.verificationResendRequestDate.getTime() + config.verification_timeout;
    return ((checkTime > Date.now())
      && (this.verificationResendAmount >= config.verification_amount));
  },

  /**
   * Check that last request timeout expired.
   *
   * @param config
   * @return {boolean}
   */
  checkLastResendVerificationRequest(config) {
    const lastRequestDate = this.verificationResendRequestDate;
    return (lastRequestDate
           && (lastRequestDate.getTime() + config.verification_timeout < Date.now()));
  },

  /**
   * Check that user cna request password reset again.
   *
   * @param config
   * @return {boolean}
   */
  checkResetPasswordRequestRule(config) {
    const checkTime = this.resetPasswordRequestDate.getTime() + config.password_reset_timeout;
    return ((checkTime > Date.now())
      && (this.resetPasswordRequestsAmount >= config.password_reset_amount));
  },

  /**
   * Check that last request timeout for password reset expired.
   *
   * @param config
   */
  checkLastResetPasswordRequest(config) {
    const lastRequestDate = this.resetPasswordRequestDate;
    return (lastRequestDate
           && (lastRequestDate.getTime() + config.password_reset_timeout < Date.now()));
  },
};

UserSchema.statics = {
  /**
   * Find user by email
   *
   * @param {string} email - User's email
   * @param {function} cb - Callback
   * @return {Query|void}
   */
  findByEmail(email, cb) {
    return this.findOne({ email, isDeleted: { $ne: true } }, cb);
  },

  /**
   * Find user by ID
   * @param {string} id - User's id
   * @param {function} cb - Callback
   * @return {Query|void}
   */
  findById(id, cb) {
    return this.findOne({ _id: id }, cb);
  },

  /**
   * Find user by verification token.
   *
   * @param {string} verificationToken - Verification Token
   * @param {function} cb - Callback
   * @return {Query|void}
   */
  getUserByVerificationToken(verificationToken, cb) {
    return this.findOne(
      {
        verificationCode: verificationToken,
        isEmailVerified: false,
      }, cb,
    );
  },

  /**
   * Find user by password reset token
   *
   * @param {string} token - Password reset token
   * @param {function} cb - Callback
   * @return {Query|void}
   */
  getUserByPasswordResetToken(token, cb) {
    return this.findOne(
      {
        resetPasswordToken: token,
        resetPasswordIsRequested: true,
      }, cb,
    );
  },
};

export default UserSchema;
