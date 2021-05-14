const Product = require('../models/products');

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products =>
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      })
    )
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

  req.user
    .createProduct({ title, price, imgUrl, description })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));

  // Product.create({ title, price, imgUrl, description })
  //   .then(() => res.redirect('/'))
  //   .catch(err => console.log(err));

  // const product = new Products(null, title, imgUrl, description, price);
  // product
  //   .save()
  //   .then(() => res.redirect('/'))
  //   .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;

  req.user
    .getProducts({ where: { id: productId } })
    .then(products => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        product: products[0],
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

  Product.findByPk(id)
    .then(product => {
      product.dataValues.title = title;
      product.dataValues.imgUrl = imgUrl;
      product.dataValues.price = price;
      product.dataValues.description = description;

      return product.save();
    })
    .then(() => {
      console.log('Product is Updated!');
      res.redirect('/');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.deleteById(productId)
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};
