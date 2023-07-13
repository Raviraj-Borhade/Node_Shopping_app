const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const adminconroller = require("../controller/admin");
const isAuthorised = require("../middleware/isAuthorised");
const { isString } = require("util");

//admin/addprod= get
router.get("/addprod", isAuthorised, adminconroller.getaddproduct);

router.get("/products", isAuthorised, adminconroller.getproducts);

// //admin/product ==post
router.post(
  "/addprod",
  // [
  //   body("title").isString().isLength({ min: 3 }).trim(),
  //   body("imgUrl").isURL(),
  //   body("price").isFloat(),
  //   body("description").isLength({ min: 5, max: 15 }),
  // ],
  isAuthorised,
  adminconroller.postaddproduct
);

router.get(
  "/editproduct/:productId",
  isAuthorised,
  adminconroller.geteditproduct
);

router.post(
  "/editproduct",
  // [
  //   body("title").isString().isLength({ min: 3 }).trim(),
  //   body("imgUrl").isURL(),
  //   body("price").isFloat(),
  //   body("description").isLength({ min: 5, max: 15 }),
  // ],
  isAuthorised,
  adminconroller.posteditproduct
);

router.post("/deleteproduct", isAuthorised, adminconroller.postdeleteproduct);

module.exports = router;
