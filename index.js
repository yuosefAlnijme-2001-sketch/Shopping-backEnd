const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");

const DBConnection = require("./config/dbConnection");
const GlobelError = require("./middlewares/errorMeddlieware");
const ApiError = require("./utils/ApiError");
const router = require("./router");

dotenv.config({ path: "config.env" });

// Connection DB
DBConnection();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());
app.options("*", cors());

if (process.env.NODE_ENV === "developments") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use(express.static(path.join(__dirname, "uploads")));

// app.use(cors());
// ✅ حماية الهيدر
// app.use(helmet());
// ✅ تحديد عدد الطلبات
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 دقيقة
//   max: 100, // أقصى عدد طلبات من نفس IP
// });
// app.use("/api/v1", limiter);
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Home Page");
});
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});
// Get error handling middleware
app.use(GlobelError);

const Port = process.env.PORT || 5000;

const server = app.listen(Port, () => {
  console.log(`Server Running with server ${Port}`);
});

// خاصه بل ايرور خارج ال express
process.on("unhandledRejection", (err) => {
  // consloe.error(`UnhandledRejection Error : ${err.name} | ${err.message}`);
  // بتوقف السيرفر و بظهر الخطا يلي خارج ال express
  server.close(() => {
    process.exit(1);
  });
});
