const db = require('../utils/database');
const Card = require('./cart');

module.exports = class Products {
  constructor(id, title, imgUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      'INSERT INTO products (title, price, imgUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imgUrl, this.description]
    );
  }

  static delete(productId) {}

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};
