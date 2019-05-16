import UserModel from '../models/user';

const { checkSchema } = require('express-validator/check');
const json_answers = require('../json_answers/signup_user');

export default checkSchema({
  email: {
    in: ['body'],
    isLength: {
      errorMessage: json_answers.error_email_is_length,
      options: { min: 1 },
    },
    isEmail: {
      errorMessage: json_answers.error_email_format,
    },
    custom: {
      errorMessage: json_answers.error_email_is_not_unique,
      options: value => new Promise(((resolve, reject) => {
        UserModel.findByEmail(value, (err, user) => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      })).then((user) => {
        if (user) {
          return false;
        }
        return true;
      }),
    },
    trim: true,
  },
  password: {
    in: ['body'],
    isLength: {
      errorMessage: json_answers.error_password_is_length,
      options: { min: 1 },
    },
  },
  password_check: {
    in: ['body'],
    isLength: {
      errorMessage: json_answers.error_password_check_is_length,
      options: { min: 1 },
    },
    custom: {
      errorMessage: json_answers.error_passwords_not_equal,
      options: (value, { req }) => value === req.body.password,
    },
  },
});
