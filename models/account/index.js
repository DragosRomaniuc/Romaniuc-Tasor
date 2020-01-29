const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  // Middleware
  preUpdateModel = require('../../middleware/preUpdateModel')({
    connection: mongoose,
    model: 'Account',
    property: 'lastLogin'
  }),
  handlePreRemoveAccount = require('../../middleware/handlePreRemoveAccount')(
    mongoose
  ),
  setHashPasswordAndSalt = require('../../middleware/setHashPasswordAndSalt'),
  // Helpers
  {
    saltHashPassword,
    checkPassword,
    createdAtFormatted,
    lastLoginFormatted
  } = require('../../utility'),
  // Model
  AccountSchema = new Schema({
    email: { type: String, required: true },
    userName: { type: String, required: true, max: 100 },
    password: { type: String, required: true, max: 100 },
    validated: { type: Boolean, default: false },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    salt: { type: String, max: 100 },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
  });

// Remove invalidated accounts after 1 hour.
AccountSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60,
    partialFilterExpression: { validated: false }
  }
);

// Hash and salt password before registering to database.
AccountSchema.pre('save', setHashPasswordAndSalt);

// Auto update lastLogin timestamp
AccountSchema.pre('updateOne', preUpdateModel);

// Remove all categories, friends before account delete.
AccountSchema.pre('remove', handlePreRemoveAccount);

AccountSchema.virtual('createdAtFormatted').get(createdAtFormatted);

AccountSchema.virtual('lastLoginFormatted').get(lastLoginFormatted);

// Handle password validation on Log In.
AccountSchema.statics.validatePassword = function(
  userId,
  originalPass,
  enteredPass,
  salt
) {
  const Account = this;
  return new Promise((resolve, reject) => {
    const passwordValid = checkPassword(originalPass, enteredPass, salt);
    if (passwordValid) {
      Account.registerHashedPassword(userId, enteredPass)
        .then(updatedUserId => resolve(updatedUserId))
        .catch(err => reject(err));
    } else {
      reject('Wrong password');
    }
  });
};

AccountSchema.statics.registerHashedPassword = function(_id, password) {
  const Account = this;
  return new Promise((resolve, reject) => {
    // New hashed & salted password.
    const { passwordHash, salt } = saltHashPassword(password);
    Account.updateOne(
      { _id },
      {
        password: passwordHash,
        salt
      }
    ).exec((err, updatedDocument) => {
      // API error.
      if (err) return reject(err);
      // No result.
      if (updatedDocument.nModified < 1) return reject('User not found');
      // Password update success
      resolve(_id);
    });
  });
};

// Add invited / requested friend account by id
AccountSchema.statics.addField = function(_id, field, value, callBack) {
  this.updateOne({ _id }, { $push: { [field]: value } }).exec(callBack);
};

// Remove invited / requested friend account by id
AccountSchema.statics.removeField = function(_id, field, value, callBack) {
  this.updateOne({ _id }, { $pull: { [field]: value } }).exec(callBack);
};

// Check if account exist.
AccountSchema.statics.isExistByEmail = function(email) {
  const Account = this;
  return new Promise((resolve, reject) => {
    Account.countDocuments({ email }).exec((err, count) => {
      // API error.
      if (err) return reject(err);
      // No result.
      if (!count) return reject('Account does not exist.');
      // Account exist.
      resolve(count);
    });
  });
};

// Handle find by Email.
AccountSchema.statics.findByEmail = function(email) {
  const Account = this;
  return new Promise((resolve, reject) => {
    Account.find({ email }).exec((err, account) => {
      // API error.
      if (err) return reject(err);

      // No result.
      if (account.length < 1) return reject('Account not found');
      // Success
      resolve(account);
    });
  });
};

module.exports = mongoose.model('Account', AccountSchema);
