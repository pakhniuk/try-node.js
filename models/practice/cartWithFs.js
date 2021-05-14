const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');
const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex(
        product => product.id === id
      );

      if (existingProductIndex !== -1) {
        const existingProduct = cart.products[existingProductIndex];
        const updatedProduct = {
          ...existingProduct,
          quantity: ++existingProduct.quantity,
        };

        cart.products[existingProductIndex] = updatedProduct;
      } else {
        const newProduct = { id: id, quantity: 1 };
        cart.products.push(newProduct);
      }

      cart.totalPrice = cart.totalPrice + +productPrice;

      fs.writeFile(p, JSON.stringify(cart), err => console.log(err));
    });
  }

  static deleteProduct(productId, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return;

      const cart = JSON.parse(fileContent);
      const currentProduct = cart.products.find(
        product => product.id === productId
      );

      if (currentProduct) {
        cart.products = cart.products.filter(
          product => product.id === productId
        );
        cart.totalPrice =
          cart.totalPrice - currentProduct.quantity * productPrice;
        fs.writeFile(p, JSON.stringify(cart), err => console.log(err));
      }
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return cb(null);
      }

      cb(JSON.parse(fileContent));
    });
  }
};
