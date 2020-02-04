const order_view = require('../views/order-view.js');

const request = require('request-promise-native');
const config = require('../config.js');

const get_timestamp = () => {
    let t = new Date();
    let timestamp = ``;
    timestamp += `${t.getFullYear()}`;
    timestamp += `-`;
    timestamp += `${t.getMonth().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`;
    timestamp += `-`;
    timestamp += `${t.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`;
    timestamp += `T`;
    timestamp += `${t.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`;
    timestamp += `:`;
    timestamp += `${t.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`;
    timestamp += `:`;
    timestamp += `${t.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`;
    timestamp += `.`;
    timestamp += `${t.getMilliseconds().toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:false})}Z`;
    return timestamp;
};


let order_number = 1000;
const get_orders = (req, res, next) => {
    let options = {
        method: 'GET',
        uri: config.flowcontrol_uri + '/api/orders/get',
        json: true
    };
    request(options).then((orders) => {

        //Convert key value objects into arrays
        if (orders.newOrders) {
            let keys = Object.keys(orders.newOrders);
            let _orders = [];
            keys.forEach((key) => {
                _orders.push(orders.newOrders[key]);
            });
            orders.newOrders = _orders;
        } else {
            orders.newOrders = {};
        }
        if (orders.wipOrders) {
            let keys = Object.keys(orders.wipOrders);
            let _orders = [];
            keys.forEach((key) => {
                _orders.push(orders.wipOrders[key]);
            });
            orders.wipOrders = _orders;
        } else {
            orders.wipOrders = {};
        }

        if (orders.finOrders) {
            let keys = Object.keys(orders.finOrders);
            let _orders = [];
            keys.forEach((key) => {
                _orders.push(orders.finOrders[key]);
            });
            orders.finOrders = _orders;
        } else {
            orders.finOrders = {};
        }

        let data = {};
        data.orders = orders;
        return res.send(order_view.orders_view(data));
    }).catch((err) => {
        console.log(err);
        return res.redirect('/error');
    });
};

const post_order_support = (req, res, next) => {
    let new_order_number = order_number++;
    let options = {
        method: 'POST',
        json: true,
        body: {
            "orderNumber": new_order_number,
            "timestamps": {
                "createdAt": get_timestamp()
            },
            "params": {
                "mcProcessTime": 5
            },
            "workCycle": "makeSupport"
        },
        uri: config.flowcontrol_uri + '/api/orders/add'
    };

    request(options).then((result) => {
        let options_start = {
            method: 'PUT',
            uri: config.flowcontrol_uri + '/api/orders/start/' + new_order_number
        };
        request(options_start).then((results_start) => {
            return res.redirect('/');
        }).catch((err) => {
            console.log(err);
            return res.redirect('/');
        });

    }).catch((err) => {
        console.log(err);
        return res.redirect('/');
    });
}

const post_order_cube = (req, res, next) => {

    let new_order_number = order_number++;

    let options = {
        method: 'POST',
        json: true,
        body: {
            "orderNumber": new_order_number,
            "timestamps": {
                "createdAt": get_timestamp()
            },
            "params": {
                "mcProcessTime": 5
            },
            "workCycle": "polishCube"
        },
        uri: config.flowcontrol_uri + '/api/orders/add'
    };

    request(options).then((result) => {
        let options_start = {
            method: 'PUT',
            uri: config.flowcontrol_uri + '/api/orders/start/' + new_order_number
        };
        request(options_start).then((results_start) => {
            return res.redirect('/');
        }).catch((err) => {
            console.log(err);
            return res.redirect('/');
        });

    }).catch((err) => {
        console.log(err);
        return res.redirect('/');
    });
}


module.exports.get_orders = get_orders;
module.exports.post_order_support = post_order_support;
module.exports.post_order_cube = post_order_cube;