import ExpressCoreUsersController from '../controllers/user';
import {
  SignupUserValidation, VerifyEmailResendValidation,
  VerifyEmailValidation, ResetPasswordRequestValidation,
  ResetPasswordValidation, ResetPasswordCheckValidation,
} from '../validations';

const asyncHandler = require('express-async-handler');

/**
 * Return all default user routes for express router.
 *
 * @param {Object} router Express router
 * @param {Object} models Application models
 * @param {Object} config Additional configuration
 */
export default function (router, models, config) {
  const usersController = new ExpressCoreUsersController(models, config);

  const signupUserValidation = new SignupUserValidation(models);
  const verifyEmailResendValidation = new VerifyEmailResendValidation(models);
  const verifyEmailValidation = new VerifyEmailValidation(models);
  const resetPasswordRequestValidation = new ResetPasswordRequestValidation(models);
  const resetPasswordValidation = new ResetPasswordValidation(models);
  const resetPasswordCheckValidation = new ResetPasswordCheckValidation(models);

  router
    .route('/users/signup')
    .post(
      signupUserValidation.validators(),
      usersController.validate.bind(usersController),
      asyncHandler(usersController.signupUserAction.bind(usersController)),
    );


  // resend verification email
  router
    .route('/users/verify_email/resend')
    .post(
      verifyEmailResendValidation.validators(),
      usersController.validate.bind(usersController),
      asyncHandler(usersController.verifyEmailResendAction.bind(usersController)),
    );

  // verify email
  router
    .route('/users/verify_email')
    .post(
      verifyEmailValidation.validators(),
      usersController.validate.bind(usersController),
      asyncHandler(usersController.verifyEmailAction.bind(usersController)),
    );

  // request password reset
  router
    .route('/users/reset_password/request')
    .post(
      resetPasswordRequestValidation.validators(),
      usersController.validate.bind(usersController),
      asyncHandler(usersController.resetPasswordRequestAction.bind(usersController)),
    );

  // reset password
  router
    .route('/users/reset_password')
    .post(
      resetPasswordValidation.validators(),
      usersController.validate.bind(usersController),
      asyncHandler(usersController.resetPasswordAction.bind(usersController)),
    );

  // check reset password token
  router
    .route('/users/reset_password/check')
    .post(
      resetPasswordCheckValidation.validators(),
      usersController.validate.bind(usersController),
      asyncHandler(usersController.resetPasswordCheckAction.bind(usersController)),
    );
}
