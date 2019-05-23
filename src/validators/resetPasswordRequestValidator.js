import validator from 'validator';

const { checkSchema } = require('express-validator/check');
const jsonAnswers = require('../json_answers/reset_password_request');

export default function (models) {
  return checkSchema({
    email: {
      in: ['body'],
      isLength: {
        errorMessage: jsonAnswers.error_email_is_length,
        options: { min: 1 },
      },
      isEmail: {
        errorMessage: jsonAnswers.error_email_format,
      },
      custom: {
        options: (value) => {
          let checkValue = value;
          if (!checkValue || checkValue === undefined) {
            checkValue = '';
          }
          if (!validator.isEmail(checkValue)) {
            return true;
          }
          return new Promise(((resolve, reject) => {
            models.User.findByEmail(checkValue, (err, user) => {
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
            throw new Error(JSON.stringify(jsonAnswers.error_no_user));
          });
        },
      },
      trim: true,
    },
  });
}
