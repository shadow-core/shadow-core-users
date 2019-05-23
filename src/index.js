// main classes
import ExpressCoreUsers from './ExpressCoreUsers';
import ExpressCoreUsersValidators from './validators';
import UsersController from './controllers/user';
import UserSchema from './schemas/user';
import UserRouter from './router/users';

// tests
import ExpressCoreUsersTestsSignup from './tests/signup';
import ExpressCoreUsersTestsEmailVerification from './tests/emailVerification';
import ExpressCoreUsersTestsResendVerificationEmail from './tests/resendVerificationEmail';
import ExpressCoreUsersTestsResetPassword from './tests/resetPassword';

export {
  // export main classes
  ExpressCoreUsers,
  ExpressCoreUsersValidators,
  UsersController,
  // Schema
  UserSchema,
  // Router
  UserRouter,

  // export tests
  ExpressCoreUsersTestsSignup,
  ExpressCoreUsersTestsEmailVerification,
  ExpressCoreUsersTestsResendVerificationEmail,
  ExpressCoreUsersTestsResetPassword,
};
