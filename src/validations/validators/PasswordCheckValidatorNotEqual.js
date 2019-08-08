/**
 * Passwords are not equal custom validator
 *
 * @return {Function}
 */
export default function PasswordCheckValidatorNotEqual() {
  return ((value, { req }) => {
    if (value && req.body.password) {
      return value === req.body.password;
    }
    return true;
  });
}
