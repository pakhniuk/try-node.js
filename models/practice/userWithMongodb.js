const mongodb = require('mongodb');

const { getDb } = require('../../utils/database');

class User {
  constructor(userName, email, cart, id) {
    this.name = userName;
    this.email = email;
    this.cart = cart;
    this._id = new mongodb.ObjectId(id);
  }

  save() {
    const db = getDb();

    return db
      .collection(users)
      .insertOne(this)
      .then(result => result)
      .catch(err => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      cartProduct => cartProduct.productId.toString() === product._id.toString()
    );

    let newQuantity = 1;
    const updatedCartItems = this.cart.items ? [...this.cart.items] : [];

    if (cartProductIndex !== -1) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: newQuantity });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDb();

    return db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(({ productId }) => productId);

    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products =>
        products.map(product => ({
          ...product,
          quantity: this.cart.items.find(
            ({ productId }) => productId.toString() === product._id.toString()
          ).quantity,
        }))
      )
      .catch(err => console.log(err));
  }

  deleteCartProduct(productId) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(
      cartProduct => cartProduct.productId.toString() !== productId.toString()
    );

    return db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();

    return this.getCart()
      .then(products => {
        return db.collection('orders').insertOne({
          products,
          user: {
            _id: this._id,
            name: this.name,
          },
        });
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne({ _id: this._id }, { $set: { cart: { ...this.cart } } });
      })
      .catch(err => console.log(err));
  }

  getOrders() {
    const db = getDb();

    return db
      .collection('orders')
      .find({ 'user._id': this._id })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();

    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then(result => result)
      .catch(err => console.log(err));
  }
}

module.exports = User;
