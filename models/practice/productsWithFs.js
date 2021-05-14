const fs = require('fs');
const path = require('path');

const Card = require('./cart');
const rootDir = require('../utils/path');

const p = path.join(rootDir, 'data', 'products.json');

const getProducts = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Products {
  constructor(id, title, imgUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    fs.readFile(p, (err, fileContent) => {
      getProducts(products => {
        if (this.id) {
          const updatedProductIndex = products.findIndex(
            product => product.id === this.id
          );
          products[updatedProductIndex] = this;
        } else {
          this.id = Math.random().toString();
          products.push(this);
        }

        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      });
    });
  }

  static delete(productId) {
    getProducts(products => {
      const currentProduct = products.find(product => product.id === productId);
      const updatedProducts = products.filter(
        product => product.id !== productId
      );

      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Card.deleteProduct(productId, currentProduct.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProducts(cb);
  }

  static findById(productId, cb) {
    getProducts(products => {
      const product = products.find(product => product.id === productId);
      cb(product);
    });
  }
};
