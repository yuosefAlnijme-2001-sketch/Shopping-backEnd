const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      minlength: [2, "The category name is too short."],
      maxlength: [100, "The category name is too long."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`;
    doc.image = imageUrl;
  }
};
CategorySchema.post("init", function (doc) {
  setImageUrl(doc);
});
CategorySchema.post("save", function (doc) {
  setImageUrl(doc);
});

const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;
