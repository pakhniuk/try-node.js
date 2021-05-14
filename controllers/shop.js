const Product = require('../models/products');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
  // Product.fetchAll()
  Product.find()
    .then(products => {
      res.render('shop/index', {
        products,
        pageTitle: 'Home Page',
        path: '/',
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Product.fetchAll()
  Product.find()
    .then(products => {
      res.render('shop/products', {
        products,
        pageTitle: 'Shop',
        path: '/products',
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then(product => {
      res.render('shop/product-details', {
        pageTitle: product.title,
        path: '/products',
        product: product,
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    // .getCart()
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        cartProducts: user.cart.items,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postCartDeleteItem = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .deleteCartProduct(productId)
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(product => {
        return {
          quantity: product.quantity,
          product: { ...product.productId._doc },
        };
      });

      const order = new Order({
        products,
        user: {
          email: user.email,
          userId: user._id,
        },
      });

      return order.save();
    })
    .then(result => req.user.clearCart())
    .then(result => res.redirect('/orders'))
    .catch(err => console.log(err));

  // req.user
  //   .addOrder()
  //   .then(result => res.redirect('/orders'))
  //   .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders,
      });
    })
    .catch(err => console.log(err));

  // req.user
  //   .getOrders()
  //   .then(orders => {
  //     res.render('shop/orders', {
  //       pageTitle: 'Orders',
  //       path: '/orders',
  //       orders,
  //     });
  //   })
  //   .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     pageTitle: 'Checkout',
//     path: '/checkout',
//   });
// };
