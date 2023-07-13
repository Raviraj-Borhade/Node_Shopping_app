const fs = require("fs");
const path = require("path");
const Product = require("../model/product");
const Order = require("../model/order");
const PDFdocument = require("pdfkit");
const { deserialize } = require("v8");
const ITEM_PER_PAGE = 8; // Number of product we want to show on the screen
const stripe = require("stripe")(
  "sk_test_51MN7sGSGcHdaRUOHAyonlyRMVdD1iuWXsAB4k14pb8QpYu0An4psm3RpBw28nTRfqiP7Ozww2RxCV0GKSu5Htglj00xoMgyjhK"
);

exports.getproduct = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems = 0;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
        .then((product) => {
          res.render("shop/productlist", {
            prods: product,
            pagetitle: "all products",
            path: "/products",
            isAuthenticated: req.session.isLoggedIn,
            currentPage: page,
            hasNextPage: ITEM_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
          });
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getdetails = (req, res, next) => {
  const prodId = req.params.productId;

  //****************************** ALTERNATIVE APPROACH******************************************* */

  // Product.findAll({where:{id:prodId}}).then((products)=>{
  //   res.render("shop/productdetail", {
  //     product: products[0], // because fetchAll() always return the array of products
  //     pagetitle: products[0
  //     ].title,
  //     path: "/products",
  //   });
  // }).catch((e)=>{
  //   console.log(e)
  // })

  //************************************************************************************************* */

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/productdetail", {
        pagetitle: product.title,

        product: product,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems = 0;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
        .then((product) => {
          res.render("shop/index", {
            prods: product,
            pagetitle: "shop",
            path: "/",
            isAuthenticated: req.session.isLoggedIn,
            currentPage: page,
            hasNextPage: ITEM_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
          });
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getcart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pagetitle: "Your cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.postcart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });

  // let fetchedCart;
  // let newQuantity = 1;

  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } }); // returns array
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       console.log(oldQuantity);
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(prodId);
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });
};

exports.getorders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pagetitle: "Your orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .removeFromCart(prodId)
    .then((result) => {
      console.log("product deleted from cart Items!!");
      res.redirect("/cart");
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.postorder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      /* Creating a new array of objects with the quantity and product properties. */
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return console.log("no order found");
      }
      // if (order.user.userId.tostring() !== req.user._id.tostring()) {
      //   return console.log("userId dont Match");
      // }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFdocument();
      res.setHeader("content-Type", "application/pdf");
      res.setHeader(
        "content-Disposition",
        'attachment; filename"' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(23).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("________________________________________________________");
      let totalprice = 0;
      order.products.forEach((prod) => {
        totalprice = totalprice + prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              "-" +
              prod.quantity +
              "*" +
              "$" +
              prod.product.price
          );
      });
      pdfDoc.text("__________________________________________________________");
      pdfDoc.fontSize(23).text("Totalprice: $" + totalprice);
      pdfDoc.end();
    })
    .catch((e) => {
      console.log(e);
    });

  // fs.readFile(invoicePath, (err, data) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.setHeader("content-Type", "application/pdf");
  //   res.setHeader(
  //     "content-Disposition",
  //     'attachment; filename"' + invoiceName + '"'
  //   );
  //   res.send(data);
  // });
  // const file = fs.createReadStream(invoicePath);
  // res.setHeader("content-Type", "application/pdf");
  // res.setHeader(
  //   "content-Disposition",
  //   'attachment; filename"' + invoiceName + '"'
  // );

  // file.pipe(res);
};

exports.getCheckOut = (req, res, next) => {
  let products;
  let total = 0;
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      products = user.cart.items;

      products.forEach((p) => {
        total = total + p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions
        .create({
          payment_method_types: ["card"],
          line_items: products.map((p) => {
            return {
              price: p.productId._id,
            };
          }),
          success_url:
            req.protocol + "://" + req.get("host") + "/checkout/success", //http://localhost:3000
          cancel_url:
            req.protocol + "://" + req.get("host") + "/checkout/cancel",
        })
        .then((session) => {
          res.render("shop/chekout", {
            path: "/checkout",
            pagetitle: "checkOut",
            products: products,
            isAuthenticated: req.session.isLoggedIn,
            totalSum: total,
            sessionId: session.id,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      console.log(e);
    });
};
