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

// Quản lý trạng thái hiển thị nút
document.addEventListener("DOMContentLoaded", function() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const submitButton = document.getElementById('submit-button');
    const paypalButtonContainer = document.getElementById('paypal-button-container');

    // Ban đầu ẩn nút PayPal và hiển thị nút submit
    paypalButtonContainer.style.display = 'none';
    submitButton.style.display = 'block';

    paymentMethods.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'paypal') {
                paypalButtonContainer.style.display = 'block';
                submitButton.style.display = 'none';
                ReactDOM.render(e(PayPalButtonComponent), paypalButtonContainer);
            } else {
                paypalButtonContainer.style.display = 'none';
                submitButton.style.display = 'block';
                ReactDOM.unmountComponentAtNode(paypalButtonContainer);
            }
        });
    });
});
