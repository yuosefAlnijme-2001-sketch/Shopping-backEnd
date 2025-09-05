const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title product required"],
      unique: [true, "title product unique"],
      minlength: [3, "Too short title product"],
      maxlength: [100, "Too long product title"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Too long description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    priceBefor: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      maxlength: [32, "To long price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    availableColors: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to a category"],
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageCoverUrl = `${process.env.BASE_URL}/product/${doc.imageCover}`;
    doc.imageCover = imageCoverUrl;
  }
  if (doc.images) {
    const images = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/product/${image}`;
      images.push(imageUrl);
    });
    doc.images = images;
  }
};
ProductSchema.post("init", function (doc) {
  setImageUrl(doc);
});
ProductSchema.post("save", function (doc) {
  setImageUrl(doc);
});

ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});
ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "subcategory",
    select: "name",
  });
  next();
});
ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "brand",
    select: "name",
  });
  next();
});

/* هين انا بستخدم ال virtual لانوا انا مستدعي ال product في ال reviews ما بنفع استدعي ال 
reviews in product عشان هيك بنعمل خانه وهميه وسميناها reviews */

// بنروح لخانه ال getProduct one وبنديها خانه اسمها ال review
ProductSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
// -_id  عشان اخفي ال id

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel;
