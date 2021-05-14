const Product = require('../models/products');

exports.getProducts = (req, res, next) => {
  // Product.fetchAll()
  Product.find()
    // .select('title price -_id') choose field what you want to fetch
    // .populate('userId', 'name') fetch all field by userId
    .then(products => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title,
    price,
    description,
    imgUrl,
    userId: req.user,
  });

  product
    .save()
    .then(result => res.redirect('/'))
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId)
    .then(product => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        product: product,
        editing: true,
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.findById(id)
    .then(product => {
      product.title = title;
      product.price = price;
      product.imgUrl = imgUrl;
      product.description = description;

      return product.save();
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  // Product.deleteById(productId)
  Product.findByIdAndDelete(productId)
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};
