import UserController from '../controllers/user';
import UserValidations from '../validations';

const asyncHandler = require('express-async-handler');

/**
 * Return all default user routes for express router.
 *
 * @param {Object} router Express router
 * @param {Object} models Application models
 * @param {Object} config Additional configuration
 */
export default function (app) {
  const userController = new UserController(app);

  const validations = {
    signupUser: new UserValidations.SignupUserValidation(app),
    verifyEmailResend: new UserValidations.VerifyEmailResendValidation(app),
    verifyEmail: new UserValidations.VerifyEmailValidation(app),
    resetPasswordRequest: new UserValidations.ResetPasswordRequestValidation(app),
    resetPassword: new UserValidations.ResetPasswordValidation(app),
    resetPasswordCheck: new UserValidations.ResetPasswordCheckValidation(app),
  };

  app.router
    .route('/users/signup')
    .post(
      validations.signupUser.validators(),
      userController.validate.bind(userController),
      asyncHandler(userController.signupUserAction.bind(userController)),
    );


  // there's not need for these routes if there's no verification by email
  if (app.config.users.mustVerifyEmail !== false) {
    // resend verification email
    app.router
      .route('/users/verify_email/resend')
      .post(
        validations.verifyEmailResend.validators(),
        userController.validate.bind(userController),
        asyncHandler(userController.verifyEmailResendAction.bind(userController)),
      );

    // verify email
    app.router
      .route('/users/verify_email')
      .post(
        validations.verifyEmail.validators(),
        userController.validate.bind(userController),
        asyncHandler(userController.verifyEmailAction.bind(userController)),
      );
  }

  // request password reset
  app.router
    .route('/users/reset_password/request')
    .post(
      validations.resetPasswordRequest.validators(),
      userController.validate.bind(userController),
      asyncHandler(userController.resetPasswordRequestAction.bind(userController)),
    );

  // reset password
  app.router
    .route('/users/reset_password')
    .post(
      validations.resetPassword.validators(),
      userController.validate.bind(userController),
      asyncHandler(userController.resetPasswordAction.bind(userController)),
    );

  // check reset password token
  app.router
    .route('/users/reset_password/check')
    .post(
      validations.resetPasswordCheck.validators(),
      userController.validate.bind(userController),
      asyncHandler(userController.resetPasswordCheckAction.bind(userController)),
    );
}
