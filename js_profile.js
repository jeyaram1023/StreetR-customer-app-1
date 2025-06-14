// js_profile.js
async function loadProfile() {
    const user = supabase.auth.user();
    if (!user) return;

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error("Error fetching profile:", error.message);
        return;
    }

    if (profile) {
        document.getElementById('profile-name').value = profile.name || '';
        document.getElementById('profile-email').value = user.email;
        document.getElementById('profile-mobile').value = profile.mobile || '';
        const address = [profile.address_street, profile.address_landmark, profile.address_district, profile.address_state, profile.address_pincode].filter(Boolean).join(', ');
        document.getElementById('profile-address').value = address;
    }
}

document.getElementById('update-profile-btn').addEventListener('click', async () => {
    const user = supabase.auth.user();
    const name = document.getElementById('profile-name').value;
    const addressParts = document.getElementById('profile-address').value.split(',');
    
    // Note: This is a simplified address parser. A real app might need separate fields.
    const updatedProfile = {
        name: name,
        address_street: addressParts[0]?.trim() || '',
        address_pincode: addressParts[addressParts.length - 1]?.trim() || '',
        updated_at: new Date()
    };

    const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);

    if (error) {
        alert('Failed to update profile: ' + error.message);
    } else {
        alert('Profile updated successfully!');
    }
});
