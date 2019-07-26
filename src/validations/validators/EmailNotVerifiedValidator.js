export default function EmailVerifiedValidator(validation) {
  return ((value) => {
    if (!value) {
      return true;
    }
    if (!validation.user) {
      return true;
    }
    return (validation.user.checkEmailVerified());
  });
}
