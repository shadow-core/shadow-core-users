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
export default function (router, models, config) {
  const userController = new UserController(models, config);

  const signupUserValidation = new UserValidations.SignupUserValidation(models);
  const verifyEmailResendValidation = new UserValidations.VerifyEmailResendValidation(models);
  const verifyEmailValidation = new UserValidations.VerifyEmailValidation(models);
  const resetPasswordRequestValidation = new UserValidations.ResetPasswordRequestValidation(models);
  const resetPasswordValidation = new UserValidations.ResetPasswordValidation(models);
  const resetPasswordCheckValidation = new UserValidations.ResetPasswordCheckValidation(models);

  router
    .route('/users/signup')
    .post(
      signupUserValidation.validators(),
      userController.validate.bind(userController),
      asyncHandler(userController.signupUserAction.bind(userController)),
    );


  // there's not need for these routes if there's no verification by email
  if (config.mustVerifyEmail !== false) {
    // resend verification email
    router
      .route('/users/verify_email/resend')
      .post(
        verifyEmailResendValidation.validators(),
        userController.validate.bind(userController),
        asyncHandler(userController.verifyEmailResendAction.bind(userController)),
      );

    // verify email
    router
      .route('/users/verify_email')
      .post(
        verifyEmailValidation.validators(),
        userController.validate.bind(userController),
        asyncHandler(userController.verifyEmailAction.bind(userController)),
      );
  }

  // request password reset
  router
    .route('/users/reset_password/request')
    .post(
      resetPasswordRequestValidation.validators(),
      userController.validate.bind(userController),
      asyncHandler(userController.resetPasswordRequestAction.bind(userController)),
    );

  // reset password
  router
    .route('/users/reset_password')
    .post(
      resetPasswordValidation.validators(),
      userController.validate.bind(userController),
      asyncHandler(userController.resetPasswordAction.bind(userController)),
    );

  // check reset password token
  router
    .route('/users/reset_password/check')
    .post(
      resetPasswordCheckValidation.validators(),
      userController.validate.bind(userController),
      asyncHandler(userController.resetPasswordCheckAction.bind(userController)),
    );
}
