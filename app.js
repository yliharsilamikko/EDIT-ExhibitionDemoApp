const express = require('express');

const body_parser = require('body-parser');

const PORT = process.env.PORT || 8080;

const order_controller = require('./controllers/order-controller.js');

const app = express();
app.use(express.static('public'));


app.get('/', order_controller.get_orders);
app.post('/order-support', order_controller.post_order_support);
app.post('/order-cube', order_controller.post_order_cube);

app.listen(PORT);