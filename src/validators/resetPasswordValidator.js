const { checkSchema } = require('express-validator/check');
const jsonResponses = require('../json_responses/reset_password');

export default function () {
  return checkSchema({
    token: {
      in: ['body'],
      isLength: {
        errorMessage: jsonResponses.error_token_is_length,
        options: { min: 1 },
      },
      trim: true,
    },
    password: {
      in: ['body'],
      isLength: {
        errorMessage: jsonResponses.error_password_is_length,
        options: { min: 1 },
      },
    },
    password_check: {
      in: ['body'],
      isLength: {
        errorMessage: jsonResponses.error_password_check_is_length,
        options: { min: 1 },
      },
      custom: {
        errorMessage: jsonResponses.error_passwords_not_equal,
        options: (value, { req }) => value === req.body.password,
      },
    },
  });
}
