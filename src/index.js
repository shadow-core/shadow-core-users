// main classes
import ExpressCoreUsers from './ExpressCoreUsers';
import ExpressCoreUsersValidators from './validators';
import UsersController from './controllers/user';
import UserModel from './models/user';
import UserRouter from './router/users';

// tests
import ExpressCoreUsersTests_Signup from './tests/signup';

export {
  // export main classes
  ExpressCoreUsers,
  ExpressCoreUsersValidators,
  UsersController,
  UserModel,
  UserRouter,

  // export tests
  ExpressCoreUsersTests_Signup,
};
