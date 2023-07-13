  Cart.getCart(cart => {
     Product.fetchall(products=>{
          const cartProducts = []
         for(product of products){
            const cartProductData = cart.products.find(prod=> prod.id === product.id)
        if(cartProductData){
          cartProducts.push({productData: product, qty: cartProductData.qty })
        }
        }
        res.render("shop/cart", {
          path: "/cart",
          pagetitle: "Your cart",
          products:cartProducts
      });
   })
   
})