const path = require("path");
const express = require("express");
const router = express.Router();
const shopconroller = require("../controller/shop");
const isAuthorised = require("../middleware/isAuthorised");

router.get("/", shopconroller.getIndex);

router.get("/productlist", shopconroller.getproduct);

router.get("/products/:productId", shopconroller.getdetails);

router.get("/cart", isAuthorised, shopconroller.getcart);

router.post("/cart", isAuthorised, shopconroller.postcart);

router.get("/orders", isAuthorised, shopconroller.getorders);

// // router.get("/checkout", shopconroller.checkout);

router.post(
  "/cart/delete-item",
  isAuthorised,
  shopconroller.postCartDeleteProduct
);

router.post("/create-order", isAuthorised, shopconroller.postorder);

router.get("/orders/:orderId", isAuthorised, shopconroller.getInvoice);

router.get("/checkout", isAuthorised, shopconroller.getCheckOut);

router.get("/checkout/success", shopconroller.postorder);

router.get("/checkout/cancel", shopconroller.getCheckOut);

module.exports = router;
