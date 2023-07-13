const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const expresshbs = require("express-handlebars");
const hbs = require("hbs");
const MONGO_URI =
  // "mongodb+srv://Raviraj:Raviraj@cluster0.pgbjgjg.mongodb.net/shop?retryWrites=true&w=majority";
  "mongodb+srv://RavirajB:Raviraj123@cluster0.mmvxfzi.mongodb.net/grocery";

const errorcontroller = require("./controller/error");

const app = express();
const store = new MongoDbStore({
  uri: MONGO_URI,
  collection: "sessions",
});

const csurfProtection = csurf();
// for multer*****************************************************
const filestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const filefilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg" || "image/jpg" || "imgae/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//************************************************************************************88 */
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(
  multer({ storage: filestorage, fileFilter: filefilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

const Adminrout = require("./routs/admin");
const Shoprout = require("./routs/shop");
const authrout = require("./routs/auth");
const User = require("./model/user");
app.use(
  //session middleware
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store, // for storing in database
  })
);
app.use(csurfProtection); /// tokens work for all non get request // have to user after the session
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((e) => {
      console.log(e);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", Adminrout);
app.use(Shoprout);
app.use(authrout);
app.get("/500", errorcontroller.get500);
app.use(errorcontroller.get404);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(3000);
    console.log("connected");
  })
  .catch((e) => {
    console.log(e);
  });

// app.listen(3000, () => {
//   console.log("server up and runing");
// });
