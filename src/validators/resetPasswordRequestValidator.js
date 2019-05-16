import validator from 'validator';
import UserModel from '../models/user';

const { checkSchema } = require('express-validator/check');
const json_answers = require('../json_answers/reset_password_request');

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
      options: (value) => {
        if (!value || value === undefined) {
          value = '';
        }
        if (!validator.isEmail(value)) {
          return true;
        }
        return new Promise(((resolve, reject) => {
          UserModel.findByEmail(value, (err, user) => {
            if (err) {
              reject(err);
            } else {
              resolve(user);
            }
          });
        })).then((user) => {
          if (user) {
            return true;
          }
          throw new Error(JSON.stringify(json_answers.error_no_user));
        });
      },
    },
    trim: true,
  },
});
