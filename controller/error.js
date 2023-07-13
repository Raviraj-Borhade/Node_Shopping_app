exports.get404 = (req, res, next) => {
  res.render("404", {
    pagetitle: "page not found",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render("500", {
    pagetitle: "error page",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};
