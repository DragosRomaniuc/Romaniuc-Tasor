const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  // Middleware
  preUpdateModel = require('../../middleware/preUpdateModel')({
    connection: mongoose,
    model: 'Category',
    property: 'lastEdit'
  }),
  handlePreRemoveCategoryFromAccount = require('../../middleware/handlePreRemoveCategoryFromAccount')(
    mongoose
  ),
  // Helpers
  { createdAtFormatted, lastEditFormatted } = require('../../utility'),
  // Model
  CategorySchema = new Schema({
    title: { type: String, required: true },
    accounts: [{ type: Schema.Types.ObjectId, ref: 'Account', required: true }],
    todoList: [{ type: Schema.Types.ObjectId, ref: 'Todo' }],
    checked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastEdit: { type: Date, default: Date.now }
  });

// Auto update lastEdit timestamp
CategorySchema.pre('updateOne', preUpdateModel);

// Remove its reference from account's categories list.
CategorySchema.pre('remove', handlePreRemoveCategoryFromAccount);

CategorySchema.virtual('createdAtFormatted').get(createdAtFormatted);

CategorySchema.virtual('lastEditFormatted').get(lastEditFormatted);

// Export model
module.exports = mongoose.model('Category', CategorySchema);
