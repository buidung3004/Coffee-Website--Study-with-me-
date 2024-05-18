const e = React.createElement;

const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

const PayPalButtonComponent = () => {
    const totalPrice = document.getElementById('paypal-button-container').dataset.totalPrice;

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: totalPrice
                }
            }]
        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then(function(details) {
            alert('Transaction completed by ' + details.payer.name.given_name);

            // Gửi dữ liệu form đến server
            const form = document.getElementById('checkout-form');
            const formData = new FormData(form);

            // Thêm thông tin giao dịch PayPal vào formData
            const formDataJSON = {
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                deliveryMethod: formData.get('deliveryMethod'),
                paymentMethod: formData.get('paymentMethod'),
                paypalOrderID: data.orderID
            };

            return fetch('/api/paypal-transaction-complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataJSON)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Chuyển hướng người dùng hoặc hiển thị thông báo thành công
                window.location.href = `/checkout/success/${data.orderId}`;
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an error processing your payment. Please try again.');
            });
        });
    };

    const onError = (err) => {
        console.error('Error during payment:', err);
        alert('There was an error processing your payment. Please try again.');
    };

    return e(PayPalButton, {
        createOrder: createOrder,
        onApprove: onApprove,
        onError: onError
    });
};

const createVnpayButton = () => {
    const vnpayButtonContainer = document.getElementById('vnpay-button-container');
    if (!document.getElementById('vnpay-checkout-button')) {
        const button = document.createElement('button');
        button.id = 'vnpay-checkout-button';
        button.className = 'btn btn-primary btn-block';
        button.innerText = 'Thanh toán với VNPay';
        button.onclick = function (event) {
            event.preventDefault(); // Ngăn chặn form submit mặc định

            const form = document.getElementById('checkout-form');
            const formData = new FormData(form);

            const fullName = formData.get('fullName');
            const phone = formData.get('phone');
            const address = formData.get('address');
            const deliveryMethod = formData.get('deliveryMethod');
            const paymentMethod = formData.get('paymentMethod');
            const amount = document.getElementById('paypal-button-container').dataset.totalPrice;

            const formBody = new URLSearchParams({
                amount: amount,
                fullName: fullName,
                phone: phone,
                address: address,
                deliveryMethod: deliveryMethod,
                paymentMethod: paymentMethod
            });

            // Gửi yêu cầu POST đến URL tạo thanh toán VNPay
            fetch('/create_payment_url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody.toString()
            })
            .then(response => response.json())
            .then(data => {
                // Redirect đến URL thanh toán VNPay
                window.location.href = data.paymentUrl;
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an error processing your payment. Please try again.');
            });
        };
        vnpayButtonContainer.appendChild(button);
    }
};

// Quản lý trạng thái hiển thị nút
document.addEventListener("DOMContentLoaded", function() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const submitButton = document.getElementById('submit-button');
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    const vnpayButtonContainer = document.getElementById('vnpay-button-container');

    // Ban đầu ẩn nút PayPal và VNPay, hiển thị nút submit
    paypalButtonContainer.style.display = 'none';
    vnpayButtonContainer.style.display = 'none';
    submitButton.style.display = 'block';

    paymentMethods.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'paypal') {
                paypalButtonContainer.style.display = 'block';
                vnpayButtonContainer.style.display = 'none';
                submitButton.style.display = 'none';
                ReactDOM.render(e(PayPalButtonComponent), paypalButtonContainer);
            } else if (this.value === 'vnpay') {
                vnpayButtonContainer.style.display = 'block';
                paypalButtonContainer.style.display = 'none';
                submitButton.style.display = 'none';
                createVnpayButton();
            } else {
                paypalButtonContainer.style.display = 'none';
                vnpayButtonContainer.style.display = 'none';
                submitButton.style.display = 'block';
                ReactDOM.unmountComponentAtNode(paypalButtonContainer);
            }
        });
    });
});
