import { BasicController } from 'shadow-core-basic';
import UserCore from '../UserCore';

/**
 * @class UserController
 * @classdesc UsersController has all required method for users - registration, email verification,
 * password reset
 */
export default class UserController extends BasicController {
  /**
   * Constructor. Pass application to it.
   *
   * @param {Object} app The main application with models, config, etc
   */
  constructor(app) {
    super(app);
    this.core = new UserCore(app);
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

    const newUser = await this.core.ProcessSignUpUser(actionParams.email, actionParams.password);
    this.core.sendVerificationEmail(newUser);
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
    const user = req.foundUser;

    // return error if too much requests
    if (this.core.checkTooMuchRequests(user)) {
      return this.returnError(this.core.jsonResponses.verifyEmailResend.errors.email.requests,
        res, 429);
    }

    // send email, add counter and return success
    await this.core.updateResendVerification(user);
    this.core.sendVerificationEmail(user);
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
    const user = await this.core.app.models.User
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
    const user = req.foundUser;

    if (this.core.checkTooMuchResetPasswordRequests(user)) {
      return this.returnError(
        this.core.jsonResponses.resetPasswordRequest.errors.email.requests,
        res, 429,
      );
    }

    // seems like we can send reset password
    await this.core.prepareResetPassword(user);
    this.core.sendResetPasswordRequestEmail(user);
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

    const user = await this.core.app.models.User.getUserByPasswordResetToken(actionParams.token);
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

    const user = await this.core.app.models.User.getUserByPasswordResetToken(actionParams.token);
    if (!user) {
      return this.returnNotFoundError(res, 'resetPasswordToken', 'Token is incorrect or already has been used');
    }

    return this.returnSuccess(this.core.getJsonResponse('resetPasswordCheck', 'success'), res);
  }
}
