const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/signupUser');

/**
 * @class SignupUserValidator
 */
export default class SignupUserValidator {
  validators() {
    return [
      // email
      body('email').not().isEmpty().withMessage(jsonResponses.errorEmailIsLength),
      body('email').isEmail().withMessage(jsonResponses.errorEmailFormat),
      this.getEmailValidatorNotUnique(),

      // password
      body('password').not().isEmpty().withMessage(jsonResponses.errorPasswordIsLength),

      // password check
      body('passwordCheck').not().isEmpty().withMessage(jsonResponses.errorPasswordCheckIsLength),
      this.getPasswordCheckValidatorNotEqual(),
    ];
  }

  getEmailValidatorNotUnique() {
    return body('email').custom((value) => {
      return new Promise((resolve, reject) => {
        this.models.User.findByEmail(value, (err, user) => {
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
    }).withMessage(jsonResponses.errorEmailIsNotUnique);
  }

  getPasswordCheckValidatorNotEqual() {
    return body('passwordCheck').custom((value, { req }) => {
      return value === req.body.password;
    }).withMessage(jsonResponses.errorPasswordsNotEqual);
  }
}
/*
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
*/
