import validator from 'validator';

/**
 * Email not unique custom validator
 *
 * @return {function(*=): Promise<any>}
 * @constructor
 */
export default function EmailValidatorNotUnique(validation) {
  return ((value, { req }) => new Promise((resolve, reject) => {
    if (!value) {
      return resolve();
    }
    if (!validator.isEmail(value)) {
      return resolve();
    }
    validation.app.models.User.findByEmail(value, (err, user) => {
      if (err) {
        return reject();
      }
      if (user) {
        req.foundUser = user;
        return reject();
      }
      return resolve();
    });
  }));
}
