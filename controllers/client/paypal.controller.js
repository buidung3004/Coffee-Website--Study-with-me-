const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

// [POST] /api/paypal-transaction-complete
module.exports.paypalTransactionComplete = async (req, res) => { 
    const cartId = req.cookies.cartId;
    const userInfo = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address
    };

    const cart = await Cart.findOne({_id: cartId});
    let products = [];

    for (const product of cart.products) {
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        };
        const productInfo = await Product.findOne({_id: product.product_id});

        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;    
        products.push(objectProduct);
    }

    const objectOrder = {
        user_id: res.locals.user._id,
        cart_id: cartId,
        userInfo: userInfo,
        products: products,
        deliveryMethod: req.body.deliveryMethod,
        paymentMethod: req.body.paymentMethod,
        statusPayment: 'Unpaid'
    };

    const order = new Order(objectOrder);
    await order.save();

    await Cart.updateOne({_id: cartId}, { products: [] });

    // Chỉ định trạng thái thanh toán khi giao dịch thành công
    if (req.body.paymentMethod === 'paypal') {
        // Giả định bạn có logic để xác nhận giao dịch PayPal ở đây
        // Nếu giao dịch PayPal thành công, cập nhật trạng thái thanh toán
        await Order.updateOne({ _id: order._id }, { statusPayment: 'paid' });
    }

    // Gửi phản hồi với thông tin order ID để client có thể xử lý redirect
    res.json({ message: 'Transaction completed successfully!', orderId: order._id });
};
