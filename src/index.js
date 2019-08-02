// main classes
import UserCore from './UserCore';
import UserValidations from './validations';
import UserController from './controllers/user';
import UserSchema from './schemas/user';
import UserRouter from './router/users';

import UserTests from './tests';


export {
  // export main classes
  UserCore,
  UserValidations,
  UserController,
  // Schema
  UserSchema,
  // Router
  UserRouter,

  // Tests
  UserTests,
};
