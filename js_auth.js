// js_auth.js
document.addEventListener('DOMContentLoaded', () => {
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    const saveDetailsBtn = document.getElementById('save-details-btn');
    const letsGoBtn = document.getElementById('lets-go-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // 1. Send OTP to user's email
    sendOtpBtn.addEventListener('click', async () => {
        const email = document.getElementById('user-email').value;
        if (!email) { return alert('Please enter a valid email.'); }

        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
            console.error('Error sending OTP:', error.message);
            alert(`Error: ${error.message}`);
        } else {
            alert('An OTP has been sent to your email.');
            showPage('otp-page');
        }
    });

    // 2. Verify OTP and check profile
    verifyOtpBtn.addEventListener('click', async () => {
        const email = document.getElementById('user-email').value;
        const token = document.getElementById('otp-input').value;
        if (!token) { return alert('Please enter the OTP.'); }

        const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
        if (error) {
            console.error('Error verifying OTP:', error.message);
            alert(`Error: ${error.message}`);
        } else if (data.session) {
            const user = data.session.user;
            // Check if user has a profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single();

            if (profile) {
                initializeSession(); // User exists, go to home
            } else {
                showPage('personal-data-page'); // New user, collect details
            }
        }
    });

    // 3. Save personal data for new users
    saveDetailsBtn.addEventListener('click', async () => {
        const user = supabase.auth.user();
        if (!user) { return alert("Authentication error. Please restart."); }

        const profileData = {
            id: user.id,
            email: user.email,
            name: document.getElementById('customer-name').value,
            mobile: document.getElementById('mobile-number').value,
            address_street: document.getElementById('street-name').value,
            address_landmark: document.getElementById('nearby-landmark').value,
            address_district: document.getElementById('district').value,
            address_state: document.getElementById('state').value,
            address_pincode: document.getElementById('pincode').value
        };

        if (!profileData.name || !profileData.mobile || !profileData.address_pincode) {
            return alert("Please fill all required fields.");
        }

        const { error } = await supabase.from('profiles').insert([profileData]);
        if (error) {
            console.error('Error saving profile:', error.message);
            alert(`Error: ${error.message}`);
        } else {
            document.getElementById('confirm-details-summary').innerHTML = `<p><strong>Name:</strong> ${profileData.name}</p><p><strong>Address:</strong> ${profileData.address_street}, ${profileData.address_pincode}</p>`;
            showPage('lets-go-page');
        }
    });

    // 4. Final confirmation to home
    letsGoBtn.addEventListener('click', initializeSession);
    document.getElementById('edit-details-btn').addEventListener('click', () => showPage('personal-data-page'));

    // 5. Logout
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        localStorage.clear();
        window.location.reload();
    });
});

async function initializeSession() {
    await loadProfile();
    await loadHomePage();
    showPage('home-page');
    document.querySelector('.app-footer').style.display = 'flex';
}
