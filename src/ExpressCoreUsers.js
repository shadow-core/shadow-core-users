import { ExpressCoreBasic } from 'shadow-core-basic';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * @class ExpressCoreUsers
 * @classdesc This is main class with all required methods for user actions.
 */
export default class ExpressCoreUsers extends ExpressCoreBasic {
  /**
   * Prepare json responses and get list if models.
   *
   * @param {Object} models
   */
  constructor(models) {
    super();
    this.models = models;
    this.addJsonResponses('signup_user', require('./json_responses/signup_user'));
    this.addJsonResponses('verify_email_resend', require('./json_responses/verify_email_resend'));
    this.addJsonResponses('verify_email', require('./json_responses/verify_email'));
    this.addJsonResponses('reset_password_request', require('./json_responses/reset_password_request'));
    this.addJsonResponses('reset_password', require('./json_responses/reset_password'));
    this.addJsonResponses('reset_password_check', require('./json_responses/reset_password_check'));
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

    const newUser = new this.models.User({
      email,
      password_hash: bcrypt.hashSync(password, 10),
      isEmailVerified: false,
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
    /* @TODO make timeout configurable */
    if ((user.verificationResendRequestDate.getTime() + 3600 * 1000) > Date.now()
      && user.verificationResendAmount >= 3) {
      return true;
    }
    return false;
  }

  /**
   * Update amount of resend verification requests and last request date.
   *
   * @param {Object} user
   * @returns {Object}
   */
  async updateResendVerification(user) {
    const result = user;
    const lastRequestDate = user.verificationResendRequestDate;
    result.verificationResendRequestDate = Date.now();
    result.verificationResendAmount += 1;
    /* @TODO make timeout configurable and move it at some method */
    if (lastRequestDate && (lastRequestDate.getTime() + 3600 * 1000 < Date.now())) {
      result.verificationResendAmount = 1;
    }

    await result.save();
  }

  /**
   * Save required data for password reset
   *
   * @param {Object} user User object
   * @returns {Promise}
   */
  async prepareResetPassword(user) {
    const result = user;
    const lastRequestDate = user.resetPasswordRequestDate;
    result.resetPasswordIsRequested = true;
    result.resetPasswordRequestDate = Date.now();
    result.resetPasswordToken = crypto.randomBytes(64).toString('hex');
    result.resetPasswordRequestsAmount += 1;
    /* @TODO make timeout configurable */
    if (lastRequestDate && (lastRequestDate.getTime() + 3600 * 1000 < Date.now())) {
      result.resetPasswordRequestsAmount = 1;
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
    /* @TODO make timeout configurable */
    if ((user.resetPasswordRequestDate.getTime() + 3600 * 1000) > Date.now()
      && user.resetPasswordRequestsAmount >= 3) {
      return true;
    }
    return false;
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
