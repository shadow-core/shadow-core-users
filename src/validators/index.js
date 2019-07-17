import SignupUserValidator from './SignupUserValidator';

//const SignupUserValidator = require('./SignupUserValidator').default;
const verifyEmailResendValidator = require('./verifyEmailResendValidator').default;
const verifyEmailValidator = require('./verifyEmailValidator').default;
const resetPasswordRequestValidator = require('./resetPasswordRequestValidator').default;
const resetPasswordValidator = require('./resetPasswordValidator').default;
const resetPasswordCheckValidator = require('./resetPasswordCheckValidator').default;

export default {
  SignupUserValidator,
  verifyEmailResendValidator,
  verifyEmailValidator,
  resetPasswordRequestValidator,
  resetPasswordValidator,
  resetPasswordCheckValidator,
};
