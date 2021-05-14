const Product = require('../models/products');
// const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        products,
        pageTitle: 'Home Page',
        path: '/',
      });
    })
    .catch(err => console.log(err));
  // Products.fetchAll()
  //   .then(([rows, fieldData]) =>
  //     res.render('shop/index', {
  //       products: rows,
  //       pageTitle: 'Home Page',
  //       path: '/',
  //     })
  //   )
  //   .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/products', {
        products,
        pageTitle: 'Shop',
        path: '/products',
      });
    })
    .catch(err => console.log(err));
  // Products.fetchAll()
  //   .then(([rows, fieldData]) =>
  //     res.render('shop/products', {
  //       products: rows,
  //       pageTitle: 'Shop',
  //       path: '/products',
  //     })
  //   )
  //   .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findByPk(productId)
    .then(product => {
      res.render('shop/product-details', {
        pageTitle: product.dataValues.title,
        path: '/products',
        product: product.dataValues,
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts();
    })
    .then(products => {
      console.log(products);
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        cartProducts: products,
      });
    })
    .catch(err => console.log(err));

  // Cart.getCart(cart => {
  //   Products.fetchAll(products => {
  //     const cartProducts = [];

  //     for (let product of products) {
  //       const cartProduct = cart.products.find(
  //         cartProduct => cartProduct.id === product.id
  //       );

  //       if (cartProduct) {
  //         cartProducts.push({
  //           productData: product,
  //           quantity: cartProduct.quantity,
  //         });
  //       }
  //     }

  //     res.render('shop/cart', {
  //       pageTitle: 'Cart',
  //       path: '/cart',
  //       cartProducts,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  let fetchedCart;
  let quantity = 1;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      let product;

      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        quantity = product.cartItem.quantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then(product => {
      fetchedCart.addProduct(product, { through: { quantity } });
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));

  // Products.findById(productId, product => {
  //   Cart.addProduct(productId, product.price);
  // });

  // res.redirect('/cart');
};

exports.postCartDeleteItem = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      const product = products[0];

      return product.cartItem.destroy();
    })
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));

  // Products.findById(productId, product => {
  //   Cart.deleteProduct(productId, product.price);
  //   res.redirect('/cart');
  // });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          const updatedProducts = products.map(product => {
            product.orderItem = {
              quantity: product.cartItem.quantity,
            };
            return product;
          });
          return order.addProducts(updatedProducts);
        })
        .catch(err => console.log(err));
    })
    .then(result => fetchedCart.setProducts(null))
    .then(result => res.redirect('/orders'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      console.log(orders);
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders,
      });
    })
    .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     pageTitle: 'Checkout',
//     path: '/checkout',
//   });
// };
