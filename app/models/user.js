const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  image: String,
  displayName: String,
  admin: Boolean,
  accessToken: String,
});

userSchema.methods.verifyPassword = function verifyPassword(password) {
  const user = this;

  return bcrypt.compareSync(password, user.password);
};

userSchema.pre('save', function passwordCheck(next) {
  const user = this;
  const SALT_FACTOR = 5;

  if (!user.isModified('password')) {
    return next();
  } else {

    bcrypt.genSalt(SALT_FACTOR, (generateError, salt) => {
      if (generateError) {
        throw new Error(generateError);
      }

      bcrypt.hash(user.password, salt, null, (hashError, hash) => {
        if (hashError) {
          throw new Error(hashError);
        }

        user.password = hash;
        return next();
      });
    });
  }
});

export default mongoose.model('User', userSchema);
