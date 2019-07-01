const { checkSchema } = require('express-validator/check');
const jsonResponses = require('../json_responses/signupUser');

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
        errorMessage: jsonResponses.errorEmailIsNotUnique,
        options: (value) => {
          return new Promise((resolve, reject) => {
            models.User.findByEmail(value, (err, user) => {
              if (err) {
                reject(err);
              } else {
                resolve(user);
              }
            });
          }).then((user) => {
            if (user) {
              return false;
            }
            return true;
          }).catch((error) => {
            console.log(error);
          });
        },
      },
      trim: true,
    },
    password: {
      in: ['body'],
      isLength: {
        errorMessage: jsonResponses.errorPasswordIsLength,
        options: { min: 1 },
      },
    },
    passwordCheck: {
      in: ['body'],
      isLength: {
        errorMessage: jsonResponses.errorPasswordCheckIsLength,
        options: { min: 1 },
      },
      custom: {
        errorMessage: jsonResponses.errorPasswordsNotEqual,
        options: (value, { req }) => value === req.body.password,
      },
    },
  });
}
