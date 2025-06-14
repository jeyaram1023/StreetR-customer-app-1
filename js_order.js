// js_order.js
async function createOrder(paymentId) {
    const user = supabase.auth.user();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const delivery_address = { ...profile }; // Copy full profile as address

    const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert([{ user_id: user.id, total_price: total, payment_id: paymentId, delivery_address: delivery_address }])
        .select()
        .single();
    
    if (orderError) {
        console.error("Error creating order:", orderError);
        return null;
    }

    const orderItems = cart.map(item => ({
        order_id: newOrder.id,
        item_id: item.id,
        quantity: item.quantity,
        price_per_item: item.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
        console.error("Error saving order items:", itemsError);
        // Here you might need logic to delete the created order if items fail to save
        return null;
    }

    cart = []; // Clear cart
    saveCart();
    updateCartDisplay();
    return newOrder;
}

async function loadOrders() {
    const container = document.getElementById('orders-list-container');
    container.innerHTML = '<p>Loading your orders...</p>';
    const user = supabase.auth.user();

    const { data, error } = await supabase
        .from('orders')
        .select(`*, order_items(quantity, items(name, image_url))`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching orders:", error);
        container.innerHTML = '<p>Could not load orders.</p>';
        return;
    }

    container.innerHTML = '';
    data.forEach(order => {
        const orderEl = document.createElement('div');
        orderEl.className = 'order-summary';
        // Display simplified order info. A click could show more details.
        orderEl.innerHTML = `
            <div>
                <h4>Order on ${new Date(order.created_at).toLocaleDateString()}</h4>
                <p>Status: <strong>${order.status}</strong></p>
                <p>Total: ₹${order.total_price.toFixed(2)}</p>
            </div>
        `;
        container.appendChild(orderEl);
    });
}
// Add listener to load orders when the orders page is shown
document.querySelector('[data-page="orders-page"]').addEventListener('click', loadOrders);
