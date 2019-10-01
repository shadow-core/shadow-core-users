import { RouterBasic } from 'shadow-core-basic';

import UserController from '../controllers/user';
import UserValidations from '../validations';

const asyncHandler = require('express-async-handler');

export default class UserRouter extends RouterBasic {
  prepare() {
    this.userController = new UserController(this.app);

    this.validations = {
      signupUser: new UserValidations.SignupUserValidation(this.app),
      verifyEmailResend: new UserValidations.VerifyEmailResendValidation(this.app),
      verifyEmail: new UserValidations.VerifyEmailValidation(this.app),
      resetPasswordRequest: new UserValidations.ResetPasswordRequestValidation(this.app),
      resetPassword: new UserValidations.ResetPasswordValidation(this.app),
      resetPasswordCheck: new UserValidations.ResetPasswordCheckValidation(this.app),
    };
  }

  compile() {
    this.routeUsersSignup();

    if (this.app.config.users.mustVerifyEmail !== false) {
      this.routeUsersVerifyEmailResend();
      this.routeUsersVerifyEmail();
    }

    this.routeUsersResetPasswordRequests();
    this.routeUsersResetPassword();
    this.routerUsersResetPasswordCheck();
  }

  routeUsersSignup() {
    this.app.router
      .route('/users/signup')
      .post(
        this.validations.signupUser.validators(),
        this.userController.validate.bind(this.userController),
        asyncHandler(this.userController.signupUserAction.bind(this.userController)),
      );
  }

  routeUsersVerifyEmailResend() {
    this.app.router
      .route('/users/verify_email/resend')
      .post(
        this.validations.verifyEmailResend.validators(),
        this.userController.validate.bind(this.userController),
        asyncHandler(this.userController.verifyEmailResendAction.bind(this.userController)),
      );
  }

  routeUsersVerifyEmail() {
    this.app.router
      .route('/users/verify_email')
      .post(
        this.validations.verifyEmail.validators(),
        this.userController.validate.bind(this.userController),
        asyncHandler(this.userController.verifyEmailAction.bind(this.userController)),
      );
  }

  routeUsersResetPasswordRequests() {
    this.app.router
      .route('/users/reset_password/request')
      .post(
        this.validations.resetPasswordRequest.validators(),
        this.userController.validate.bind(this.userController),
        asyncHandler(this.userController.resetPasswordRequestAction.bind(this.userController)),
      );
  }

  routeUsersResetPassword() {
    this.app.router
      .route('/users/reset_password')
      .post(
        this.validations.resetPassword.validators(),
        this.userController.validate.bind(this.userController),
        asyncHandler(this.userController.resetPasswordAction.bind(this.userController)),
      );
  }

  routerUsersResetPasswordCheck() {
    this.app.router
      .route('/users/reset_password/check')
      .post(
        this.validations.resetPasswordCheck.validators(),
        this.userController.validate.bind(this.userController),
        asyncHandler(this.userController.resetPasswordCheckAction.bind(this.userController)),
      );
  }
}
