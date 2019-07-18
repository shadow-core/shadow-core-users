import ExpressCoreUsersController from '../controllers/user';
import {
  SignupUserValidator, VerifyEmailResendValidator,
  VerifyEmailValidator, ResetPasswordRequestValidator,
  ResetPasswordValidator, ResetPasswordCheckValidator,
} from '../validators';

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

  const signupUserValidator = new SignupUserValidator(models);
  const verifyEmailResendValidator = new VerifyEmailResendValidator(models);
  const verifyEmailValidator = new VerifyEmailValidator(models);
  const resetPasswordRequestValidator = new ResetPasswordRequestValidator(models);
  const resetPasswordValidator = new ResetPasswordValidator(models);
  const resetPasswordCheckValidator = new ResetPasswordCheckValidator(models);

  router
    .route('/users/signup')
    .post(
      signupUserValidator.validators(),
      usersController.validate.bind(usersController),
      asyncHandler(usersController.signupUserAction.bind(usersController)),
    );


  // resend verification email
  router
    .route('/users/verify_email/resend')
    .post(
      verifyEmailResendValidator.validators(),
      usersController.validate.bind(usersController),
      asyncHandler(usersController.verifyEmailResendAction.bind(usersController)),
    );

  // verify email
  router
    .route('/users/verify_email')
    .post(
      verifyEmailValidator.validators(),
      usersController.validate.bind(usersController),
      asyncHandler(usersController.verifyEmailAction.bind(usersController)),
    );

  // request password reset
  router
    .route('/users/reset_password/request')
    .post(
      resetPasswordRequestValidator.validators(),
      usersController.validate.bind(usersController),
      asyncHandler(usersController.resetPasswordRequestAction.bind(usersController)),
    );

  // reset password
  router
    .route('/users/reset_password')
    .post(
      resetPasswordValidator.validators(),
      usersController.validate.bind(usersController),
      asyncHandler(usersController.resetPasswordAction.bind(usersController)),
    );

  // check reset password token
  router
    .route('/users/reset_password/check')
    .post(
      resetPasswordCheckValidator.validators(),
      usersController.validate.bind(usersController),
      asyncHandler(usersController.resetPasswordCheckAction.bind(usersController)),
    );
}
