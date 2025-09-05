const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    // المستخدم يلي عندو المنتجات يلي بدو يشتريهم
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must be belong to user"],
    },
    // المنتجات يلي انت ضفتهم في السله
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    // الضريبه
    taxPrice: {
      type: Number,
      deafult: 0,
    },
    // سعر التوصيل
    shippingPrice: {
      type: Number,
      default: 0,
    },
    // سعر المنتجات يلي بلسله سواء كان في خصم او لا
    totalOrderPrice: {
      type: Number,
    },
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postCode: String,
    },
    // وسائل الدفع عنا طرقتين card and cash
    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    // عشان نعرف اذا دفع ولا لا
    isPaid: {
      type: Boolean,
      default: false,
    },
    // تاريخ الدفع
    paidAt: Date,
    // هل المنتج وصل العميل ولا لا
    isDelivered: {
      type: Boolean,
      default: false,
    },
    // تاريخ التوصيل
    DeliveredAt: Date,
  },
  { timestamps: true }
);

OrderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name imgProfile email phone",
  }).populate({
    path: "cartItems.product",
    select: "title imageCover",
  });
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
