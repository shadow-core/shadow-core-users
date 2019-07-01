const { checkSchema } = require('express-validator/check');
const jsonResponses = require('../json_responses/verify_email_resend');

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
              throw new Error(JSON.stringify(jsonResponses.error_verified));
            }
            return true;
          } else {
            if (!value) {
              return true;
            }
            throw new Error(JSON.stringify(jsonResponses.error_no_user));
          }
        }),
      },
      trim: true,
    },
  });
}
