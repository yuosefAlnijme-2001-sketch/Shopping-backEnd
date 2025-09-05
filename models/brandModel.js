const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      minlength: [2, "The brand name is too short."],
      maxlength: [100, "The brand name is too long."],
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
    const imageUrl = `${process.env.BASE_URL}/brand/${doc.image}`;
    doc.image = imageUrl;
  }
};
BrandSchema.post("init", function (doc) {
  setImageUrl(doc);
});
BrandSchema.post("save", function (doc) {
  setImageUrl(doc);
});

const BrandModel = mongoose.model("Brand", BrandSchema);
module.exports = BrandModel;
