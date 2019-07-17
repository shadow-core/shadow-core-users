import validator from 'validator';

const { checkSchema } = require('express-validator');
const jsonResponses = require('../json_responses/resetPasswordRequest');

export default function (models) {
  return checkSchema({
    email: {
      in: ['body'],
      isLength: {
        errorMessage: jsonResponses.errorEmailIsLength,
        options: { min: 1 },
      },
      isEmail: {
        errorMessage: jsonResponses.errorEmailFormat,
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
            throw new Error(JSON.stringify(jsonResponses.errorNoUser));
          });
        },
      },
      trim: true,
    },
  });
}
