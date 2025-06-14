// js_home.js
async function loadHomePage() {
    fetchPopularItems();
    fetchAllItems();
}

async function fetchPopularItems() {
    const container = document.getElementById('popular-items-container');
    container.innerHTML = '<p>Loading popular items...</p>';

    const { data, error } = await supabase
        .from('items')
        .select(`*, sellers(shop_name)`)
        .order('like_count', { ascending: false })
        .limit(4);

    if (error) {
        container.innerHTML = `<p>Error loading items.</p>`;
        console.error("Error fetching popular items:", error);
        return;
    }
    renderItems(data, container);
}

async function fetchAllItems() {
    const container = document.getElementById('all-items-container');
    container.innerHTML = '<p>Loading all items...</p>';

    const { data, error } = await supabase
        .from('items')
        .select(`*, sellers(shop_name)`)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = `<p>Error loading items.</p>`;
        console.error("Error fetching all items:", error);
        return;
    }
    renderItems(data, container);
}

function renderItems(items, container) {
    container.innerHTML = '';
    if (items.length === 0) {
        container.innerHTML = `<p>No items found.</p>`;
        return;
    }
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.dataset.itemId = item.id;
        card.innerHTML = `
            <img src="${item.image_url || 'https://via.placeholder.com/150'}" alt="${item.name}">
            <div class="item-card-info">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
                <div class="like-section">
                    <button class="like-btn icon-btn"><i class="material-icons">favorite_border</i></button>
                    <span>${item.like_count}</span>
                </div>
            </div>
        `;
        // TODO: Add event listener to card to open item detail page
        container.appendChild(card);
    });
}
