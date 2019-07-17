const { checkSchema } = require('express-validator');
const jsonResponses = require('../json_responses/verifyEmail');

export default function () {
  return checkSchema({
    verificationToken: {
      in: ['body'],
      isLength: {
        errorMessage: jsonResponses.errorNoVerificationToken,
        options: { min: 1 },
      },
      trim: true,
    },
  });
}
