// const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRouters = require('./routes/admin');
const shopRouters = require('./routes/shop');
const errorsController = require('./controllers/errors');
const db = require('./utils/database');
const sequelize = require('./utils/database');
const Product = require('./models/products');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

// db.execute('SELECT * FROM products')
//   .then(result => console.log(result[0], result[1]))
//   .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  User.findById('5e56de15609514921159f483')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => console.log(err));
});

app.use(shopRouters);
app.use('/admin', adminRouters);

app.use(errorsController.get404);

// app.use((req, res, next) => {
//   console.log('In the middleware!');
//   next(); // Allows the request to continue in next middleware lime;
// });

// app.use((req, res, next) => {
//   console.log('In the 2-nd middleware!');
//   res.send('<h1>Hello from express middleware!</h1>');
// });

// const server = http.createServer(app);

// server.listen(3000);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  .sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Test', email: 'test@example.com' });
    }

    return user;
  })
  .then(user => {
    return user
      .getCart()
      .then(cart => !cart && user.createCart())
      .catch(err => console.log(err));
  })
  .then(cart => {
    console.log(cart);
    app.listen(3000);
  })
  .catch(err => console.log(err));
