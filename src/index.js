// main classes
import ExpressCoreUsers from './ExpressCoreUsers';
import ExpressCoreUsersValidations from './validations';
import UsersController from './controllers/user';
import UserSchema from './schemas/user';
import UserRouter from './router/users';

// tests
import ExpressCoreUsersTestsSignup from './tests/signup';
import ExpressCoreUsersTestsEmailVerification from './tests/emailVerification';
import ExpressCoreUsersTestsResendVerificationEmail from './tests/resendVerificationEmail';
import ExpressCoreUsersTestsResetPassword from './tests/resetPassword';

import ExpressCoreUsersTestsEmailVerificationEmpty from './tests/emailVerificationEmpty';
import ExpressCoreUsersTestsResendVerificationEmailEmpty from './tests/resendVerificationEmailEmpty';


export {
  // export main classes
  ExpressCoreUsers,
  ExpressCoreUsersValidations,
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

  ExpressCoreUsersTestsEmailVerificationEmpty,
  ExpressCoreUsersTestsResendVerificationEmailEmpty,
};
