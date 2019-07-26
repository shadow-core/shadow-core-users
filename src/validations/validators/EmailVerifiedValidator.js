export default function EmailValidatorVerified(validation) {
  return ((value) => {
    if (!value) {
      return true;
    }
    if (!validation.user) {
      return true;
    }
    return (validation.user.isEmailVerified !== true);
  });
}
