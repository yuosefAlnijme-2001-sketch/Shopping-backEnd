const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      minlength: [2, "The subCategory name is too short."],
      maxlength: [100, "The subCategory name is too long."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Category required"],
    },
  },

  { timestamps: true }
);

SubCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const SubCategoryModel = mongoose.model("SubCategory", SubCategorySchema);
module.exports = SubCategoryModel;
