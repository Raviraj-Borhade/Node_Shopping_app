const crypto = require("crypto");
const { validationResult } = require("express-validator");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie").split("=")[1];

  res.render("auth/login", {
    pagetitle: "Login",
    path: "/login",
    errorMessage: req.flash("error"), // after setting the message it get auto deleted
    oldInput: {
      email: "",
      password: "",
    },
  });
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.satus(422).render("auth/login", {
      pagetitle: "login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((e) => {
              console.log(e);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password");
          res.redirect("/login");
        })
        .catch((e) => {
          console.log(e);
          res.redirect("/login");
        });
    })
    .catch((e) => {
      console.log(e);
      res.redirect("/login");
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getsignup = (req, res, next) => {
  res.render("auth/signup", {
    pagetitle: "Sign Up",
    path: "/signup",
    errorMessage: req.flash("error"),
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

exports.postsignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      pagetitle: "Sign Up",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      }, // for keeping old input
    });
  }

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exist!!!!!");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });

          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          // return transporter.sendMail({
          //   to: email,
          //   from: "ravi@nodeshop.com",
          //   subject: "Signup succeeded!",
          //   html: "<h1>You successfully signed up!</h1>",
          // });
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getResetPassword = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pagetitle: "Reset Password",
    errorMessage: req.flash("error"),
  });
};

exports.postResetPassword = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.find({ email: email });
    console.log(user);

    const match = await bcrypt.compare(password, user.password);
    console.log(match);
  } catch (e) {
    console.log(e);
  }

  // crypto.randomBytes(32, (err, buffer) => {
  //   if (err) {
  //     console.log(err);
  //     return res.redirect("/reset");
  //   }

  //   const token = buffer.toString("hex");
  //   User.findOne({ email: req.body.email })
  //     .then((user) => {
  //       if (!user) {
  //         req.flash("error", "no user exist with such email");
  //         return res.redirect("/reset");
  //       }

  //       user.resetToken = token;
  //       user.resetTokenExpiration = Date.now() + 3600000;
  //       return user.save();
  //     })
  //     .then(() => {
  //       res.redirect("/login");
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // });
};
