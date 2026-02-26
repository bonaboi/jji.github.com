// ============================================================
// EMAILJS BOOKING FORM HANDLER
// ============================================================

async function submitBooking(e) {
    e.preventDefault();
    
    const d = getData();
    const ejs = d.site.emailjs || {};
    const btn = document.getElementById('submit-btn');
    const errEl = document.getElementById('form-error');
    const successEl = document.getElementById('form-success');

    if (errEl) errEl.style.display = 'none';

    // Validate form fields
    const fname = document.getElementById('bf-fname');
    const lname = document.getElementById('bf-lname');
    const phone = document.getElementById('bf-phone');
    const email = document.getElementById('bf-email');
    
    if (!fname || !fname.value.trim()) {
        if (errEl) {
            errEl.style.display = 'block';
            errEl.textContent = '⚠️ First name is required.';
        }
        return;
    }
    
    if (!lname || !lname.value.trim()) {
        if (errEl) {
            errEl.style.display = 'block';
            errEl.textContent = '⚠️ Last name is required.';
        }
        return;
    }
    
    if (!phone || !phone.value.trim()) {
        if (errEl) {
            errEl.style.display = 'block';
            errEl.textContent = '⚠️ Phone number is required.';
        }
        return;
    }
    
    if (!email || !email.value.trim() || !email.value.includes('@')) {
        if (errEl) {
            errEl.style.display = 'block';
            errEl.textContent = '⚠️ Valid email is required.';
        }
        return;
    }

    // Get selected escort
    const escortSelect = document.getElementById('bf-escort');
    const selectedEscort = escortSelect ? escortSelect.options[escortSelect.selectedIndex]?.text || 'Any companion' : 'Any companion';
    const escortId = escortSelect ? escortSelect.value : '';

    // Get service
    const serviceSelect = document.getElementById('bf-service');
    const selectedService = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex]?.text || 'Not specified' : 'Not specified';

    // Save booking locally
    const booking = {
        id: Date.now(),
        firstName: fname.value.trim(),
        lastName: lname.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        escortId: escortId ? parseInt(escortId) : null,
        escortName: selectedEscort,
        service: selectedService,
        date: document.getElementById('bf-date') ? document.getElementById('bf-date').value : '',
        time: document.getElementById('bf-time') ? document.getElementById('bf-time').value : '',
        message: document.getElementById('bf-message') ? document.getElementById('bf-message').value : '',
        timestamp: new Date().toISOString()
    };
    
    if (!d.bookings) d.bookings = [];
    d.bookings.push(booking);
    saveData(d);

    // Try to send email if configured
    if (ejs.serviceId && ejs.templateId && ejs.publicKey && ejs.recipientEmail) {
        if (btn) {
            btn.textContent = 'Sending…';
            btn.disabled = true;
            btn.style.opacity = '0.7';
        }

        try {
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS not loaded');
            }

            emailjs.init(ejs.publicKey);
            
            const params = {
                to_email: ejs.recipientEmail,
                from_name: fname.value.trim() + ' ' + lname.value.trim(),
                from_email: email.value.trim(),
                phone: phone.value.trim(),
                escort: selectedEscort,
                service: selectedService,
                preferred_date: document.getElementById('bf-date') ? document.getElementById('bf-date').value || 'Not specified' : 'Not specified',
                preferred_time: document.getElementById('bf-time') ? document.getElementById('bf-time').value || 'Not specified' : 'Not specified',
                message: document.getElementById('bf-message') ? document.getElementById('bf-message').value || 'No message' : 'No message',
            };
            
            await emailjs.send(ejs.serviceId, ejs.templateId, params);
            
        } catch (err) {
            console.error('EmailJS error:', err);
            // Still show success because booking was saved locally
        }
    }
    
    // Show success
    if (successEl) successEl.classList.add('show');
    
    // Reset form
    const form = document.getElementById('booking-form');
    if (form) form.reset();
    
    if (btn) btn.style.display = 'none';
}