const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
  name: String
});

categoriesSchema.statics.createCategory = async function (name) {
  const response = await this.create({ name });
  return response;
};

categoriesSchema.statics.updateCategory = async function (
  currentName,
  newName
) {
  const filter = { name: currentName };
  const update = { name: newName };

  const response = await this.findOneAndReplace(filter, update);

  return response;
};

categoriesSchema.statics.deleteCategory = async function (name) {
  const response = await this.deleteOne({ name });

  return response;
};

categoriesSchema.statics.getCategories = async function () {
  const response = await this.find().exec();

  return response;
};

module.exports = mongoose.model('Categories', categoriesSchema);
