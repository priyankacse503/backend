
const Order = require('../models/orders');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
dotenv.config();

const premiummembership = async (request, response, next) => {
   
    try {

        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        var options = {
            amount: 5000,
            currency: "INR",
        };
        const orderDetails = await rzp.orders.create(options);
        const user = request.user;
        const { id, status } = orderDetails;
        await user.createOrder({
            orderid: id,
            status: status,
        })
        response.status(200).json({ key_id: rzp.key_id, orderid: id, user: user });

    } catch (error) {
        console.log(error);
    }
}

const updatetransactionstatus = async (request, response, next) => {
    const { order_id, payment_id } = request.body;

    try {
        const user = request.user;
        user.ispremiumuser = true;
        await Promise.all([
            user.save(),
            Order.update(
                { paymentid: payment_id, status: "Successful" },
                { where: { orderid: order_id } }
            )
        ])
        response.status(202).json({ success: true, message: "Thank youfor being a premium user" });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: "Error updating transaction" });
    }
}

module.exports = {
    premiummembership,
    updatetransactionstatus
}