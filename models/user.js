const mongoose = require("mongoose");
const bcript = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name user required"],
      minlength: [2, "Too short name"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: [true, "email is unique"],
      lowercase: true,
    },
    phone: String,
    imgProfile: String,
    passwordchangeAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    // بيساعد إنك تمنع التلاعب، مثلاً: لو دخل المستخدم الكود 5 مرات خطأ، ما تخليه يجرب بعدها.
    resetCodeAttempts: {
      type: Number,
      default: 0,
    },
    // بيساعد إنك تمنع التلاعب، مثلاً: لو دخل المستخدم الكود 5 مرات خطأ، ما تخليه يجرب بعدها.

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [3, "Too short password"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "manger"],
      default: "user",
    },

    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postCode: String,
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcript.hash(this.password, 12);
  next();
});

const setImageUrl = (doc) => {
  if (doc.imgProfile) {
    const imageUrl = `${process.env.BASE_URL}/user/${doc.imgProfile}`;
    doc.imgProfile = imageUrl;
  }
};
UserSchema.post("init", function (doc) {
  setImageUrl(doc);
});
UserSchema.post("save", function (doc) {
  setImageUrl(doc);
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
