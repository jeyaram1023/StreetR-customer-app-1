// js_main.js
document.addEventListener('DOMContentLoaded', () => {
    // Hide footer nav on auth pages initially
    document.querySelector('.app-footer').style.display = 'none';

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.dataset.page;
            showPage(pageId);
            // Update active state on nav buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Handle "More" category buttons
    document.querySelectorAll('.more-category-btn').forEach(button => {
        button.addEventListener('click', () => showPage('coming-soon-page'));
    });
    document.getElementById('back-to-main-btn').addEventListener('click', () => showPage('more-page'));

    // Check auth state on load
    const session = supabase.auth.session();
    if (session) {
        initializeSession();
    } else {
        showPage('email-page');
    }
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const newPage = document.getElementById(pageId);
    if (newPage) {
        newPage.classList.add('active');
    } else {
        console.error(`Page with ID "${pageId}" not found.`);
    }
}
