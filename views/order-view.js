const orders_view = (data) => {

    let orders = data.orders;
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
    <title>Manufacturing Company</title>
    <meta http-equiv="refresh" content="5" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    </head>
    <body>
    <form action="/order-support" method="POST">
        <button type="submit">Order Support part</button>
    </form>
        <form action="/order-cube" method="POST">
        <button type="submit">Order Cube part</button>
    </form>
    ${data.count}
    `;

    if (!orders) {
        console.log("Error: orders is empty");
        return "Error: orders is empty";
    }

    html += `<div class="orders-container">`;
    orders.newOrders.forEach((order) => {
        html += `<div class="order new-order">Order id: ${order.orderNumber}, manufacturing: ${order.workCycle}</div>`;
    });

    orders.wipOrders.forEach((order) => {
        html += `<div class="order wip-order">Order id: ${order.orderNumber}, manufacturing: ${order.workCycle}</div>`;
    });

    orders.finOrders.forEach((order) => {
        html += `<div class="order fin-order">Order id: ${order.orderNumber}, manufacturing: ${order.workCycle}</div>`;
    });
    html += `</div>`;
    html += `
    </body>
    </html>
    `;

    return html;

};



module.exports.orders_view = orders_view;