const Product = require("../model/product");
const { validationResult } = require("express-validator");
const fileHelper = require("../util/file");

exports.getaddproduct = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "views", "addprod.html"));
  res.render("admin/editproduct", {
    pagetitle: "ADD PRODUCT ",
    path: "/admin/addprod",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    hasError: false,
    errorMessage: null,
  });
};

exports.postaddproduct = (req, res, next) => {
  //   products.push({ title: req.body.title });

  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;

  if (!image) {
    return res.status(500).render("admin/editproduct", {
      pagetitle: "add product",
      path: "/admin/addprod",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imgUrl: imgUrl,

        description: description,
        price: price,
      },
      errorMessage: "image not found",
    });
  }

  const imgUrl = image.path;

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(422).render("admin/editproduct", {
  //     pagetitle: "add product",
  //     path: "/admin/addprod",
  //     editing: false,
  //     hasError: true,
  //     product: {
  //       title: title,
  //       imgUrl: imgUrl,
  //       description: description,
  //       price: price,
  //     },
  //     errorMessage: errors.array()[0].msg,
  //   });
  // }

  const product = new Product({
    title: title,
    imgUrl: imgUrl,
    description: description,
    price: price,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log("product created");
      res.redirect("/admin/products");
    })
    .catch((e) => {
      console.log(e);
    });
  //***************************** ALTERNATE WAY ************************************************ */
  // Product.create({
  //   title:title,
  //   imgUrl:imgUrl,
  //   description:description,
  //   price:price,
  //   userId:req.user.id

  // }).then((result)=>{
  //   console.log(result)
  //   res.redirect('/admin/products')
  // }).catch((e)=>{
  //   console.log(e)
  // })
};

exports.geteditproduct = (req, res, next) => {
  const editmode = req.query.edit;

  if (!editmode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      console.log(product);

      res.render("admin/editproduct", {
        pagetitle: "edit product ",
        path: "/admin/editprod",
        editing: editmode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
        hasError: false,
        errorMessage: null,
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getproducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("name price -_id")
    // .populate("userId", "name")            // for retrive only selecetd data
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pagetitle: "All products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.posteditproduct = (req, res, next) => {
  const prodId = req.body.productId;

  const updatedtitle = req.body.title;
  const image = req.file;
  const updateddescription = req.body.description;
  const updatedprice = req.body.price;

  // const errors = validationResult(req);
  // console.log(errors.array());
  // if (!errors.isEmpty()) {
  //   return res.status(422).render("admin/editproduct", {
  //     pagetitle: "edit product",
  //     path: "/admin/editprod",
  //     editing: true,
  //     hasError: true,
  //     product: {
  //       title: updatedtitle,
  //       imgUrl: updatedimgUrl,
  //       description: updateddescription,
  //       price: updatedprice,
  //     },
  //     errorMessage: errors.array()[0].msg,
  //   });
  // }

  Product.findById(prodId)
    .then((product) => {
      if (!product.userId.equals(req.user._id)) {
        console.log(product.userId, req.user._id);
        return res.redirect("/");
      }

      product.title = updatedtitle;
      if (image) {
        fileHelper.deletefile(product.imgUrl);
        product.imgUrl = image.path;
      }

      product.description = updateddescription;
      product.price = updatedprice;

      return product.save().then(() => {
        res.redirect("/admin/products");
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.postdeleteproduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return console.log("no product found");
      }
      fileHelper.deletefile(product.imgUrl);
      return Product.findByIdAndRemove(prodId)
        .then(() => {
          console.log("product deleted");
          res.redirect("/admin/products");
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      console.log(e);
    });
};
