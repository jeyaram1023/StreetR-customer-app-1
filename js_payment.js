// js_payment.js
document.getElementById('order-now-btn').addEventListener('click', () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (total <= 0) {
        alert("Your cart is empty!");
        return;
    }

    const user = supabase.auth.user();
    // In a real app, you get the key from a secure source
    const razorpayKey = 'YOUR_RAZORPAY_KEY_ID'; // Replace with your key

    var options = {
        "key": razorpayKey,
        "amount": total * 100, // Amount is in currency subunits. 100 paise = 1 INR
        "currency": "INR",
        "name": "StreetR Foods",
        "description": "Food & Snacks Order",
        "image": "https://via.placeholder.com/120?text=StreetR",
        "handler": async function (response) {
            // This function is called on successful payment
            const paymentId = response.razorpay_payment_id;
            alert("Payment successful! Payment ID: " + paymentId);

            // Create the order in your database
            const newOrder = await createOrder(paymentId);
            if (newOrder) {
                alert("Order placed successfully! Order ID: " + newOrder.id);
                showPage('orders-page');
                loadOrders();
            } else {
                alert("There was an issue placing your order after payment. Please contact support.");
            }
        },
        "prefill": {
            "name": document.getElementById('profile-name').value,
            "email": user.email,
            "contact": document.getElementById('profile-mobile').value
        },
        "theme": {
            "color": "#FF9800"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
});
