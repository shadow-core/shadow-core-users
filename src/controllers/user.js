import { BasicController } from 'shadow-core-basic';
import ExpressCoreUsers from '../ExpressCoreUsers';
// import sendVerificationEmail from '../../mails/verification_email';
// import sendResetPasswordRequestEmail from '../../mails/password_reset_email';

/**
 * @class UsersController
 * @classdesc UsersController has all required method for users - registration, email verification,
 * password reset
 */
export default class UsersController extends BasicController {
  /**
   * Constructor. Pass models to it.
   *
   * @param {Object} models Object with applications models.
   * @param {Object} config Additional configuration things.
   */
  constructor(models, config = {}) {
    super();
    this.models = models;
    this.config = config;
    this.core = new ExpressCoreUsers(this.models, this.config);
  }

  /**
   * Sign up API endpoint.
   * This endpoint checks that email is unique and is email, passwords are not empty and equal.
   *
   * The result will be either error with code and error message or success.
   *
   * This will also create account for user.
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Promise}
   */
  async signupUserAction(req, res) {
    const actionParams = this.getMatchedData(req);

    await this.core.ProcessSignUpUser(actionParams.email, actionParams.password);
    // sendVerificationEmail(newUser);
    return this.returnSuccess(this.core.getJsonResponse('signupUser', 'success'), res);
  }

  /**
   * Resend verification email.
   *
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Promise}
   */
  async verifyEmailResendAction(req, res) {
    const actionParams = this.getMatchedData(req);

    const user = await this.core.models.User.findByEmail(actionParams.email);

    // return error if too much requests
    if (this.core.checkTooMuchRequests(user)) {
      return this.returnError(this.core.getJsonResponse('verifyEmailResend', 'errorTooMuchRequests'), res, 429);
    }

    // send email, add counter and return success
    await this.core.updateResendVerification(user);
    // sendVerificationEmail(user);
    return this.returnSuccess(this.core.getJsonResponse('verifyEmailResend', 'success'), res);
  }

  /**
   * Verify email token action
   *
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Promise}
   */
  async verifyEmailAction(req, res) {
    const actionParams = this.getMatchedData(req);

    // find user by token
    const user = await this.core.models.User
      .getUserByVerificationToken(actionParams.verificationToken);
    if (!user) {
      return this.returnNotFoundError(res, 'verificationToken', 'Email verification token is incorrect or outdated');
    }
    user.isEmailVerified = true;
    await user.save();
    return this.returnSuccess(this.core.getJsonResponse('verifyEmail', 'success'), res);
  }

  /**
   * Request new password reset action.
   *
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Promise}
   */
  async resetPasswordRequestAction(req, res) {
    const actionParams = this.getMatchedData(req);

    const user = await this.core.models.User.findByEmail(actionParams.email);

    if (this.core.checkTooMuchResetPasswordRequests(user)) {
      return this.returnError(this.core.getJsonResponse('resetPasswordRequest', 'errorResetPasswordTooMuchRequests'), res, 429);
    }

    // seems like we can send reset password
    await this.core.prepareResetPassword(user);
    // sendResetPasswordRequestEmail(user);
    return this.returnSuccess(this.core.getJsonResponse('resetPasswordRequest', 'success'), res);
  }

  /**
   * Reset password with token.
   *
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Promise}
   */
  async resetPasswordAction(req, res) {
    const actionParams = this.getMatchedData(req);

    const user = await this.core.models.User.getUserByPasswordResetToken(actionParams.token);
    if (!user) {
      return this.returnNotFoundError(res, 'resetPasswordToken', 'Token is incorrect or already has been used');
    }

    await this.core.updateUserPassword(user, actionParams.password);

    return this.returnSuccess(this.core.getJsonResponse('resetPassword', 'success'), res);
  }

  /**
   * Check reset password token.
   *
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Promise}
   */
  async resetPasswordCheckAction(req, res) {
    const actionParams = this.getMatchedData(req);

    const user = await this.core.models.User.getUserByPasswordResetToken(actionParams.token);
    if (!user) {
      return this.returnNotFoundError(res, 'resetPasswordToken', 'Token is incorrect or already has been used');
    }

    return this.returnSuccess(this.core.getJsonResponse('resetPasswordCheck', 'success'), res);
  }
}
