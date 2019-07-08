import ExpressCoreUsersController from '../controllers/user';
import ExpressCoreUsersValidators from '../validators';

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

  // sign up user
  router
    .route('/users/signup')
    .post(
      ExpressCoreUsersValidators.signupUserValidator(models),
      usersController.checkValidationErrors.bind(usersController),
      asyncHandler(usersController.signupUserAction.bind(usersController)),
    );

  // resend verification email
  router
    .route('/users/verify_email/resend')
    .post(
      ExpressCoreUsersValidators.verifyEmailResendValidator(models),
      usersController.checkValidationErrors.bind(usersController),
      asyncHandler(usersController.verifyEmailResendAction.bind(usersController)),
    );

  // verify email
  router
    .route('/users/verify_email')
    .post(
      ExpressCoreUsersValidators.verifyEmailValidator(models),
      usersController.checkValidationErrors.bind(usersController),
      asyncHandler(usersController.verifyEmailAction.bind(usersController)),
    );

  // request password reset
  router
    .route('/users/reset_password/request')
    .post(
      ExpressCoreUsersValidators.resetPasswordRequestValidator(models),
      usersController.checkValidationErrors.bind(usersController),
      asyncHandler(usersController.resetPasswordRequestAction.bind(usersController)),
    );

  // reset password
  router
    .route('/users/reset_password')
    .post(
      ExpressCoreUsersValidators.resetPasswordValidator(models),
      usersController.checkValidationErrors.bind(usersController),
      asyncHandler(usersController.resetPasswordAction.bind(usersController)),
    );

  // check reset password token
  router
    .route('/users/reset_password/check')
    .post(
      ExpressCoreUsersValidators.resetPasswordCheckValidator(models),
      usersController.checkValidationErrors.bind(usersController),
      asyncHandler(usersController.resetPasswordCheckAction.bind(usersController)),
    );
}
