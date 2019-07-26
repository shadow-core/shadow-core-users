import validator from 'validator';

/**
 * Check that user with this email exists.
 *
 * @param validation
 * @return {function(*=, {req?: *}): Promise<any>}
 * @constructor
 */
export default function EmailExistsValidator(validation) {
  return ((value, { req }) => new Promise((resolve, reject) => {
    if (!value) {
      return resolve();
    }
    if (!validator.isEmail(value)) {
      return resolve();
    }
    validation.models.User.findByEmail(value, (err, user) => {
      if (err) {
        return reject();
      }
      if (user) {
        req.foundUser = user;
        validation.user = user;
        return resolve();
      }
      return reject();
    });
  }));
}
