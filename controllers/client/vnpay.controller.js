
const crypto = require('crypto');
const dayjs = require('dayjs');

const Cart = require('../../models/cart.model'); 
const Product = require('../../models/product.model'); 
const Order = require('../../models/order.model'); 

// Định nghĩa hàm sortObject
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
}

// Hàm hash (tạo chữ ký)
function hash(secretKey, data, algorithm = 'SHA512', encoding = 'utf-8') {
    const hmac = crypto.createHmac(algorithm, secretKey);
    return hmac.update(data).digest('hex');
}

// [POST] '/create_payment_url'
module.exports.vnpayCreatePayment = async (req, res) => {
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || '127.0.0.1';
    
    const tmnCode = process.env.vnp_TmnCode;
    const secretKey = process.env.vnp_HashSecret;
    const vnpUrl = process.env.vnp_Url;
    const returnUrl = process.env.vnp_ReturnUrl;

    const date = dayjs();
    const createDate = date.format('YYYYMMDDHHmmss'); // Định dạng yyyyMMddHHmmss
    const orderId = date.format('HHmmss');

    // Đảm bảo rằng amount là một số hợp lệ
    const amount = parseFloat(req.body.amount * 24500 *100); // Sử dụng req.body thay vì req.query và nhân với 24500 để chuyển đổi sang đồng
    if (isNaN(amount)) {
        return res.status(400).send('Invalid amount');
    }
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
        cart_id: cartId,
        userInfo: userInfo,
        products: products,
        deliveryMethod: req.body.deliveryMethod,
        paymentMethod: req.body.paymentMethod,
        statusPayment: 'unpaid'
    };

    const order = new Order(objectOrder);
    await order.save();



    await Cart.updateOne({_id: cartId}, { products: [] });

    // Lưu id của đơn hàng vào cookie
    res.cookie('orderId', order._id.toString(), { maxAge: 900000, httpOnly: true });



    let vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': tmnCode,
        'vnp_Locale': 'vn',
        'vnp_CurrCode': 'VND',
        'vnp_TxnRef': orderId,
        'vnp_OrderInfo': 'Thanh toan don hang ' + orderId,
        'vnp_OrderType': 'other',
        'vnp_Amount': amount.toString(),
        'vnp_ReturnUrl': returnUrl,
        'vnp_IpAddr': ipAddr,
        'vnp_CreateDate': createDate
    };


    // Sắp xếp các tham số và thêm chúng vào URLSearchParams
    const redirectUrl = new URL(vnpUrl, 'https://sandbox.vnpayment.vn'); // Cung cấp một URL cơ sở hợp lệ
    Object.entries(vnp_Params)
        .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
        .forEach(([key, value]) => {
            // Bỏ qua các giá trị rỗng
            if (!value || value === '' || value === undefined || value === null) {
                return;
            }
            redirectUrl.searchParams.append(key, value.toString());
        });

    // Tạo chuỗi ký
    const signData = redirectUrl.search.slice(1).toString();


    // Tạo chữ ký
    const signed = hash(secretKey, Buffer.from(signData, 'utf-8'));
    redirectUrl.searchParams.append('vnp_SecureHash', signed);



    res.json({ paymentUrl: redirectUrl.toString() });
}

// [GET] '/vnpay_return'
module.exports.vnpayReturn = async (req, res) => {
    
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    // Xóa vnp_SecureHash và vnp_SecureHashType khỏi tham số
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp các tham số và tạo chuỗi ký
    const sortedParams = new URLSearchParams();
    Object.entries(vnp_Params)
        .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
        .forEach(([key, value]) => {
            if (value) {
                sortedParams.append(key, value);
            }
        });

    const signData = sortedParams.toString();

    // Tạo chữ ký
    const secretKey = process.env.vnp_HashSecret;
    const signed = hash(secretKey, Buffer.from(signData, 'utf-8'));

    if (secureHash === signed) {
        // Xử lý khi thanh toán thành công
        const orderId = req.cookies.orderId; // Lấy orderId từ cookie

        try {
            // Tìm đơn hàng bằng orderId
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).send('Order not found');
            }

            // Cập nhật trạng thái thanh toán của đơn hàng
            order.statusPayment = 'paid';
            await order.save();
            
            res.redirect(`/checkout/success/${order._id}`);
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).send('Internal Server Error');
        }

    } else {
        res.status(400).send('Invalid signature');
    }
};