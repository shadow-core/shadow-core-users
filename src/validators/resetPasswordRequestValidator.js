import validator from 'validator';

const { checkSchema } = require('express-validator/check');
const jsonResponses = require('../json_responses/reset_password_request');

export default function (models) {
  return checkSchema({
    email: {
      in: ['body'],
      isLength: {
        errorMessage: jsonResponses.error_email_is_length,
        options: { min: 1 },
      },
      isEmail: {
        errorMessage: jsonResponses.error_email_format,
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
            throw new Error(JSON.stringify(jsonResponses.error_no_user));
          });
        },
      },
      trim: true,
    },
  });
}
