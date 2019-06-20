import { ExpressCoreBasic } from 'shadow-core-basic';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * This is main class with all required methods for user actions.
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
    this.addJsonResponses('signup_user', require('./json_answers/signup_user'));
    this.addJsonResponses('verify_email_resend', require('./json_answers/verify_email_resend'));
    this.addJsonResponses('verify_email', require('./json_answers/verify_email'));
    this.addJsonResponses('reset_password_request', require('./json_answers/reset_password_request'));
    this.addJsonResponses('reset_password', require('./json_answers/reset_password'));
    this.addJsonResponses('reset_password_check', require('./json_answers/reset_password_check'));
  }

  /**
   * Find user by email.
   *
   * @TODO this is got it be moved/removed to schema
   *
   * @param email
   * @returns {Promise.<void>}
   */
  async getUserByEmail(email) {
    const user = await this.models.User.findByEmail(email);
    return user;
  }

  /**
   * Save new user/account
   *
   * @param email
   * @param password
   * @constructor
   */
  async ProcessSignUpUser(email, password) {
    const verificationCode = crypto.randomBytes(64).toString('hex');

    /* @TODO Make this method as model method */
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
   * Check if there was more than 3 resend verification requests for last hour.
   *
   * @param user
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
   * Update some data for user for resend verification
   *
   * @param user
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
     * Find user by verification token.
     *
     * @param {string} verificationToken
     * @returns {Object}
     */
  async getUserByVerificationToken(verificationToken) {
    /* @TODO make this a model method */
    const user = await this.models.User.findOne(
      {
        verificationCode: verificationToken,
        isEmailVerified: false,
      },
    ).exec();
    return user;
  }

  /**
     * Save required data for password reset
     *
     * @param user
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
     * Check if there was more than 3 request for last hour.
     *
     * @param user
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
     * Find user with password reset token.
     * @TODO make this a model method.
     *
     * @param token
     * @return {Object}
     */
  async getUserByPasswordResetToken(token) {
    const user = this.models.User.findOne({
      resetPasswordToken: token,
      resetPasswordIsRequested: true,
    }).exec();
    return user;
  }

  /**
     * Update user password
     *
     * @param user
     * @param password
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
