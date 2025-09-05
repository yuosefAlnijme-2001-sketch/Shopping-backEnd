const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const bcript = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const sendWhatsApp = require("../utils/sendWhatsApp");
// const createToken = require("../utils/createToken");

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });
  // const token = createToken(user._id);
  const token = await jwt.sign(
    { userId: user._id },
    process.env.JWT_KEY_SECRIPT,
    {
      expiresIn: process.env.EXPIRES,
    }
  );
  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcript.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 400));
  }
  // const token = createToken(user._id);
  const token = await jwt.sign(
    { userId: user._id },
    process.env.JWT_KEY_SECRIPT,
    {
      expiresIn: process.env.EXPIRES,
    }
  );

  res.status(200).json({ data: user, token });
});

// للتاكد من ان المستخدم سجل دخول او لا
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exeist , if exsit get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("You are not login , please login first", 401));
  }
  // 2) Verify token
  const decoded = jwt.verify(token, process.env.JWT_KEY_SECRIPT);
  // 3) check if user exsist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "the user that belong to this token does no longer exist",
        401
      )
    );
  }
  // 4) check if user change his password after token created
  if (currentUser.passwordchangeAt) {
    const passChangeGetTime = parseInt(
      currentUser.passwordchangeAt.getTime() / 1000,
      10
    );
    if (passChangeGetTime > decoded.iat) {
      // Password changed after token create
      return next(
        new ApiError(
          "User recently change his password , please login again...",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

// @desc    Authorization (User Permissions)
// ["admin", "manager"]

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access role
    // 2) access user
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

// @desc    Forgot password
// @route   POST /api/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account.
   \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account
    secure.\n The E-shop Team`;

  await sendEmail({
    email: user.email,
    subject: "Your password reset code (valid for 10 min)",
    message,
  });
  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

exports.VerifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hasedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  // هين بنتاكد اذا كان الكود يلي بعتوا على الايميل هوا نفسوا يلي انت كاتبوا بلانبت ولا لا
  // وكمان بتاكد اذا كان التاريخ يلي انت سجلتوا بكون اقل من عشر دقايق ولا لا
  // $gt : Date.now() تعني يعني جيب الوقت الحالي
  const user = await User.findOne({
    passwordResetCode: hasedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 400));
  }
  // تحقق من عدد المحاولات
  // اذا كان مدخل الرمز اكثر من 5 مرات راح يحذف الرمز ويبعت رمز جديد
  if (user.resetCodeAttempts >= 5) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.resetCodeAttempts = 0;
    await user.save();
    return next(new ApiError("Too many attempts. Try again later", 429));
  }
  user.passwordResetVerified = true;
  user.resetCodeAttempts = 0;
  await user.save();

  res.status(200).json({ status: "Success", message: "Code verified" });
});

// @desc    Reset password
// @route   POST /api/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});

// forgo Password SMS WhatsApp
exports.forgotPasswordWhatsApp = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ phone: req.body.phone });
  if (!user) {
    return next(
      new ApiError(
        `Dont found user for this number phone ${req.body.phone}`,
        404
      )
    );
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  if (user.resetCodeAttempts > 5) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.resetCodeAttempts = 0;
    await user.save();
    return next(new ApiError("Too many attempts. Try again later", 429));
  }

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = true;
  await user.save();

  const message = `مرحبا ${user.name}،\nرمز إعادة تعيين كلمة المرور هو: ${resetCode}\nصالح لمدة 10 دقائق.`;

  await sendWhatsApp(user.phone, message);

  res
    .status(200)
    .json({ status: "Success", message: "تم إرسال الكود عبر واتساب" });
});
