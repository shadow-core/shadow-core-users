const { checkSchema } = require('express-validator');
const jsonResponses = require('../json_responses/resetPasswordCheck');

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
  });
}
