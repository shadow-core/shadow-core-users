const { checkSchema } = require('express-validator/check');
const jsonResponses = require('../json_responses/verifyEmailResend');

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
        options: (value) => new Promise(((resolve, reject) => {
          if (!value) {
            resolve(null);
          }
          models.User.findByEmail(value, (err, user) => {
            if (err) {
              reject(err);
            } else {
              resolve(user);
            }
          });
        })).then((user) => {
          if (user) {
            if (user.isEmailVerified) {
              throw new Error(JSON.stringify(jsonResponses.errorVerified));
            }
            return true;
          } else {
            if (!value) {
              return true;
            }
            throw new Error(JSON.stringify(jsonResponses.errorNoUser));
          }
        }),
      },
      trim: true,
    },
  });
}
