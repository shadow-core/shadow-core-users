import { BasicController } from 'shadow-core-basic';
import ExpressCoreUsers from '../ExpressCoreUsers';
// import sendVerificationEmail from '../../mails/verification_email';
// import sendResetPasswordRequestEmail from '../../mails/password_reset_email';

/**
 * UsersController class.
 * Used for sign-up and login.
 */
export default class UsersController extends BasicController {
  /**
   * Constructor. Pass model to it.
   *
   * @param {Object} models
   */
  constructor(models) {
    super();
    this.models = models;
    this.core = new ExpressCoreUsers(this.models);
  }

  /**
   * Sign up API endpoint.
   * This endpoint checks that email is unique and is email, passwords are not empty and equal.
   *
   * The result will be either error with code and error message or success.
   *
   * This will also create account for user.
   * @param req
   * @param res
   */
  async signupUserAction(req, res) {
    const errors = this.core.getValidationResult(req);
    if (!errors.isEmpty()) {
      return this.returnInvalidErrors(errors.array(), res);
    }

    const actionParams = this.core.getMatchedData(req);

    await this.core.ProcessSignUpUser(actionParams.email, actionParams.password);
    // sendVerificationEmail(newUser);
    return this.returnSuccess(this.core.getJsonResponse('signup_user', 'success'), res);
  }

  /**
     * Resend verification email.
     *
     * @param req
     * @param res
     * @returns {Promise.<void>}
     */
  async verifyEmailResendAction(req, res) {
    const errors = this.core.getValidationResult(req);
    if (!errors.isEmpty()) {
      return this.returnInvalidErrors(errors.array(), res);
    }

    const actionParams = this.core.getMatchedData(req);

    const user = await this.core.getUserByEmail(actionParams.email);

    // return error if too much requests
    if (this.core.checkTooMuchRequests(user)) {
      return this.returnError(this.core.getJsonResponse('verify_email_resend', 'too_much_requests'), res, 429);
    }

    // send email, add counter and return success
    await this.core.updateResendVerification(user);
    // sendVerificationEmail(user);
    return this.returnSuccess(this.core.getJsonResponse('verify_email_resend', 'success'), res);
  }

  /**
     * Verify email token action
     *
     * @param req
     * @param res
     * @returns {Promise.<void>}
     */
  async verifyEmailAction(req, res) {
    const errors = this.core.getValidationResult(req);
    if (!errors.isEmpty()) {
      return this.returnInvalidErrors(errors.array(), res);
    }

    const actionParams = this.core.getMatchedData(req);

    // find user by token
    const user = await this.core.getUserByVerificationToken(actionParams.verification_token);
    if (!user) {
      return this.returnNotFoundError(res, 'verification_token', 'Email verification token is incorrect or outdated');
    }
    user.isEmailVerified = true;
    await user.save();
    return this.returnSuccess(this.core.getJsonResponse('verify_email', 'success'), res);
  }

  /**
     * Reset password action.
     *
     * @param req
     * @param res
     * @returns {Promise.<void>}
     */
  async resetPasswordRequestAction(req, res) {
    const errors = this.core.getValidationResult(req);
    if (!errors.isEmpty()) {
      return this.returnInvalidErrors(errors.array(), res);
    }

    const actionParams = this.core.getMatchedData(req);

    const user = await this.core.getUserByEmail(actionParams.email);

    if (this.core.checkTooMuchResetPasswordRequests(user)) {
      return this.returnError(this.core.getJsonResponse('reset_password_request', 'error_reset_password_too_much_requests'), res, 429);
    }

    // seems like we can send reset password
    await this.core.prepareResetPassword(user);
    // sendResetPasswordRequestEmail(user);
    return this.returnSuccess(this.core.getJsonResponse('reset_password_request', 'success'), res);
  }

  /**
     * Reset password with token
     *
     * @param req
     * @param res
     * @returns {Promise.<void>}
     */
  async resetPasswordAction(req, res) {
    const errors = this.core.getValidationResult(req);
    if (!errors.isEmpty()) {
      return this.returnInvalidErrors(errors.array(), res);
    }

    const actionParams = this.core.getMatchedData(req);

    const user = await this.core.getUserByPasswordResetToken(actionParams.token);
    if (!user) {
      return this.returnNotFoundError(res, 'reset_password_token', 'Token is incorrect or already has been used');
    }

    await this.core.updateUserPassword(user, actionParams.password);

    return this.returnSuccess(this.core.getJsonResponse('reset_password', 'success'), res);
  }

  /**
     * Check reset password token.
     *
     * @param req
     * @param res
     * @returns {Promise.<void>}
     */
  async resetPasswordCheckAction(req, res) {
    const errors = this.core.getValidationResult(req);
    if (!errors.isEmpty()) {
      return this.returnInvalidErrors(errors.array(), res);
    }

    const actionParams = this.core.getMatchedData(req);

    const user = await this.core.getUserByPasswordResetToken(actionParams.token);
    if (!user) {
      return this.returnNotFoundError(res, 'reset_password_token', 'Token is incorrect or already has been used');
    }

    return this.returnSuccess(this.core.getJsonResponse('reset_password_check', 'success'), res);
  }
}
