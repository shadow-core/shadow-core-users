import ExpressCoreUsersController from '../controllers/user';
import ExpressCoreUsersValidators from '../validators';

const asyncHandler = require('express-async-handler');

/**
 * Return all default user routes for express router.
 *
 * @param router
 */
export default function (router, models) {
  const usersController = new ExpressCoreUsersController(models);

  // sign up user
  router
    .route('/users/signup')
    .post(
      ExpressCoreUsersValidators.signupUserValidator(models),
      asyncHandler(usersController.signupUserAction.bind(usersController)),
    );

  // resend verification email
  router
    .route('/users/verify_email/resend')
    .post(
      ExpressCoreUsersValidators.verifyEmailResendValidator(models),
      asyncHandler(usersController.verifyEmailResendAction.bind(usersController)),
    );

  // verify email
  router
    .route('/users/verify_email')
    .post(
      ExpressCoreUsersValidators.verifyEmailValidator(models),
      asyncHandler(usersController.verifyEmailAction.bind(usersController)),
    );

  // request password reset
  router
    .route('/users/reset_password/request')
    .post(
      ExpressCoreUsersValidators.resetPasswordRequestValidator(models),
      asyncHandler(usersController.resetPasswordRequestAction.bind(usersController)),
    );

  // reset password
  router
    .route('/users/reset_password')
    .post(
      ExpressCoreUsersValidators.resetPasswordValidator(models),
      asyncHandler(usersController.resetPasswordAction.bind(usersController)),
    );

  // check reset password token
  router
    .route('/users/reset_password/check')
    .post(
      ExpressCoreUsersValidators.resetPasswordCheckValidator(models),
      asyncHandler(usersController.resetPasswordCheckAction.bind(usersController)),
    );
}
