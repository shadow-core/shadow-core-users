import UserModel from '../models/user';

const { checkSchema } = require('express-validator/check');
const json_answers = require('../json_answers/verify_email_resend');

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
          if (user.isEmailVerified) {
            throw new Error(JSON.stringify(json_answers.error_verified));
          }
          return true;
        }
        throw new Error(JSON.stringify(json_answers.error_verified));
      }),
    },
    trim: true,
  },
});
