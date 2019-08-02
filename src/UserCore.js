import { ExpressCoreBasic } from 'shadow-core-basic';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * @class UserCore
 * @classdesc This is main class with all required methods for user actions.
 */
export default class UserCore extends ExpressCoreBasic {
  /**
   * Prepare json responses and get list if models.
   *
   * @param {Object} models
   */
  constructor(models, config) {
    super();
    this.models = models;

    // by default only three requests are allowed in one hour
    if (config.verification_timeout === undefined) config.verification_timeout = 3600 * 1000;
    if (config.verification_amount === undefined) config.verification_amount = 3;
    if (config.password_reset_timeout === undefined) config.password_reset_timeout = 3600 * 1000;
    if (config.password_reset_amount === undefined) config.password_reset_amount = 3;
    // default verification values
    if (config.maxVerificationTime === undefined) config.maxVerificationTime = 7 * 24 * 3600 * 1000;
    if (config.mustVerifyEmail === undefined) config.mustVerifyEmail = true;

    this.config = config;

    this.addJsonResponses('signupUser', require('./json_responses/signupUser'));
    this.addJsonResponses('verifyEmailResend', require('./json_responses/verifyEmailResend'));
    this.addJsonResponses('verifyEmail', require('./json_responses/verifyEmail'));
    this.addJsonResponses('resetPasswordRequest', require('./json_responses/resetPasswordRequest'));
    this.addJsonResponses('resetPassword', require('./json_responses/resetPassword'));
    this.addJsonResponses('resetPasswordCheck', require('./json_responses/resetPasswordCheck'));
  }

  /**
   * Save new user/account
   *
   * @param {string} email new user email
   * @param {string} password new user password
   * @return {Object} newly created user
   */
  async ProcessSignUpUser(email, password) {
    const verificationCode = crypto.randomBytes(64).toString('hex');

    // check if email should be verified
    let isEmailVerified = false;
    if (this.config.mustVerifyEmail === false) {
      isEmailVerified = true;
    }

    const password_hash = bcrypt.hashSync(password, 10);

    const newUser = new this.models.User({
      email,
      password_hash,
      isEmailVerified,
      verificationCode,
    });
    await newUser.save();
    return newUser;
  }

  /**
   * Check if user went over the number of requests for specified period
   *
   * @param {Object} user
   * @returns {boolean}
   */
  checkTooMuchRequests(user) {
    if (!user.verificationResendAmount) {
      return false;
    }
    return user.checkVerificationRequestRule(this.config);
  }

  /**
   * Update amount of resend verification requests and last request date.
   *
   * @param {Object} user
   * @returns {Object}
   */
  async updateResendVerification(user) {
    const result = user;
    result.verificationResendRequestDate = Date.now();
    result.verificationResendAmount += 1;
    if (user.checkLastResendVerificationRequest(this.config)) {
      result.verificationResendAmount = 1;
    }

    await result.save();
  }

  /**
   * Check reset password requests limit
   *
   * @param {Object} user
   * @returns {boolean}
   */
  checkTooMuchResetPasswordRequests(user) {
    if (!user.resetPasswordRequestsAmount) {
      return false;
    }
    return user.checkResetPasswordRequestRule(this.config);
  }

  /**
   * Save required data for password reset
   *
   * @param {Object} user User object
   * @returns {Promise}
   */
  async prepareResetPassword(user) {
    const result = user;
    result.resetPasswordIsRequested = true;
    result.resetPasswordRequestDate = Date.now();
    result.resetPasswordToken = crypto.randomBytes(64).toString('hex');
    result.resetPasswordRequestsAmount += 1;
    /* @TODO make timeout configurable */

    if (user.checkLastResetPasswordRequest(this.config)) {
      result.resetPasswordRequestsAmount = 1;
    }

    await result.save();
  }

  /**
   * Update user password
   *
   * @param {string} user - User object
   * @param {string} password - new password
   * @return {Promise}
   */
  async updateUserPassword(user, password) {
    const result = user;
    result.password_hash = bcrypt.hashSync(password, 10);
    result.resetPasswordIsRequested = false;
    result.resetPasswordRequestDate = null;
    result.resetPasswordRequestsAmount = 0;
    result.resetPasswordToken = null;
    await result.save();
  }
}