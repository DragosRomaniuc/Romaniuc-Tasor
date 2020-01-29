const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  // Middleware
  preUpdateModel = require('../../middleware/preUpdateModel')({
    connection: mongoose,
    model: 'Todo',
    property: 'lastEdit'
  }),
  // Helpers
  { createdAtFormatted, lastEditFormatted } = require('../../utility'),
  // Model
  TodoSchema = new Schema({
    title: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    checked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastEdit: { type: Date, default: Date.now },
      public: { type: Boolean, default: false}
  });

// Auto update lastEdit timestamp
TodoSchema.pre('updateOne', preUpdateModel);

TodoSchema.virtual('createdAtFormatted').get(createdAtFormatted);

TodoSchema.virtual('lastEditFormatted').get(lastEditFormatted);

module.exports = mongoose.model('Todo', TodoSchema);
