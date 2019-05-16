import ExpressCoreUsersController from '../controllers/user';
import ExpressCoreUsersValidators from '../validators';

const asyncHandler = require('express-async-handler');

/**
 * Return all default user routes for express router.
 *
 * @param router
 */
export default function (router) {
  const usersController = new ExpressCoreUsersController();

  // sign up user
  router
    .route('/users/signup')
    .post(
      ExpressCoreUsersValidators.signupUserValidator,
      asyncHandler(usersController.signupUserAction.bind(usersController)),
    );

  // resend verification email
  router
    .route('/users/verify_email/resend')
    .post(
      ExpressCoreUsersValidators.verifyEmailResendValidator,
      asyncHandler(usersController.verifyEmailResendAction.bind(usersController)),
    );

  // verify email
  router
    .route('/users/verify_email')
    .post(
      ExpressCoreUsersValidators.verifyEmailValidator,
      asyncHandler(usersController.verifyEmailAction.bind(usersController)),
    );

  // request password reset
  router
    .route('/users/reset_password/request')
    .post(
      ExpressCoreUsersValidators.resetPasswordRequestValidator,
      asyncHandler(usersController.resetPasswordRequestAction.bind(usersController)),
    );

  // reset password
  router
    .route('/users/reset_password')
    .post(
      ExpressCoreUsersValidators.resetPasswordValidator,
      asyncHandler(usersController.resetPasswordAction.bind(usersController)),
    );

  // check reset password token
  router
    .route('/users/reset_password/check')
    .post(
      ExpressCoreUsersValidators.resetPasswordCheckValidator,
      asyncHandler(usersController.resetPasswordCheckAction.bind(usersController)),
    );
}
