const { checkSchema } = require('express-validator/check');
const jsonResponses = require('../json_responses/resetPassword');

export default function () {
  return checkSchema({
    token: {
      in: ['body'],
      isLength: {
        errorMessage: jsonResponses.errorTokenIsLength,
        options: { min: 1 },
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
