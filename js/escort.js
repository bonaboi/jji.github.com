// ============================================================
// ESCORT PROFILE PAGE FUNCTIONALITY
// ============================================================

// Load escort profile on page load
document.addEventListener('DOMContentLoaded', function() {
    loadEscortProfile();
});

function loadEscortProfile() {
    // Get escort ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const escortId = parseInt(urlParams.get('id'));
    
    if (!escortId) {
        showError('No escort specified');
        return;
    }
    
    const d = getData();
    const escort = d.escorts.find(e => e.id === escortId);
    
    if (!escort) {
        showError('Escort not found');
        return;
    }
    
    renderEscortProfile(escort);
    renderEscortReviews(escortId);
}

function showError(message) {
    const container = document.getElementById('escort-profile-content');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">😕</div>
                <h2 style="font-family: 'Cormorant Garamond', serif; margin-bottom: 1rem;">${message}</h2>
                <a href="index.html#escorts" class="btn">Back to Companions</a>
            </div>
        `;
    }
}

function renderEscortProfile(escort) {
    const container = document.getElementById('escort-profile-content');
    if (!container) return;
    
    // Update page title
    document.title = `${escort.name} - ${getData().site.name}`;
    
    // Build gallery HTML
    let galleryHtml = '';
    if (escort.gallery && escort.gallery.length > 0) {
        galleryHtml = escort.gallery.map(img => `
            <div class="gallery-item" style="cursor: pointer;" onclick="openLightbox('${img}')">
                <img src="${img}" alt="${escort.name}" style="width:100%;height:100%;object-fit:cover;" onerror="if(!this.src.includes('placeholder')) this.src='https://via.placeholder.com/400x500?text=${escort.name}'">
            </div>
        `).join('');
    } else {
        galleryHtml = `
            <div class="gallery-item">
                <img src="${escort.photo}" alt="${escort.name}" style="width:100%;height:100%;object-fit:cover;">
            </div>
        `;
    }
    
    // Build rates table
    const ratesHtml = escort.rates ? `
        <table style="width:100%; border-collapse: collapse; margin-top: 1rem;">
            <tr style="border-bottom: 1px solid var(--border);">
                <th style="text-align: left; padding: 0.5rem 0;">Service</th>
                <th style="text-align: right; padding: 0.5rem 0;">Rate</th>
            </tr>
            ${escort.rates.incall30 ? `<tr><td style="padding: 0.5rem 0;">Incall 30min</td><td style="text-align: right;">$${escort.rates.incall30}</td></tr>` : ''}
            ${escort.rates.incall60 ? `<tr><td style="padding: 0.5rem 0;">Incall 60min</td><td style="text-align: right;">$${escort.rates.incall60}</td></tr>` : ''}
            ${escort.rates.incall90 ? `<tr><td style="padding: 0.5rem 0;">Incall 90min</td><td style="text-align: right;">$${escort.rates.incall90}</td></tr>` : ''}
            ${escort.rates.outcall60 ? `<tr><td style="padding: 0.5rem 0;">Outcall 60min</td><td style="text-align: right;">$${escort.rates.outcall60}</td></tr>` : ''}
            ${escort.rates.outcall90 ? `<tr><td style="padding: 0.5rem 0;">Outcall 90min</td><td style="text-align: right;">$${escort.rates.outcall90}</td></tr>` : ''}
            ${escort.rates.overnight ? `<tr><td style="padding: 0.5rem 0;">Overnight</td><td style="text-align: right;">$${escort.rates.overnight}</td></tr>` : ''}
        </table>
    ` : '<p style="color: var(--muted);">Contact for rates</p>';
    
    // Build contact info
    const contactHtml = escort.contact ? `
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
            ${escort.contact.signal ? `<div style="display: flex; align-items: center; gap: 0.75rem;"><span style="font-size: 1.2rem;">📱</span> <span>Signal: ${escort.contact.signal}</span></div>` : ''}
            ${escort.contact.telegram ? `<div style="display: flex; align-items: center; gap: 0.75rem;"><span style="font-size: 1.2rem;">✈️</span> <span>Telegram: ${escort.contact.telegram}</span></div>` : ''}
            ${escort.contact.whatsapp ? `<div style="display: flex; align-items: center; gap: 0.75rem;"><span style="font-size: 1.2rem;">📞</span> <span>WhatsApp: ${escort.contact.whatsapp}</span></div>` : ''}
            ${escort.contact.discord ? `<div style="display: flex; align-items: center; gap: 0.75rem;"><span style="font-size: 1.2rem;">🎮</span> <span>Discord: ${escort.contact.discord}</span></div>` : ''}
        </div>
    ` : '';
    
    container.innerHTML = `
        <!-- Back button -->
        <div style="margin-bottom: 2rem;">
            <a href="index.html#escorts" style="color: var(--gold); text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">←</span> Back to Companions
            </a>
        </div>
        
        <!-- Profile header -->
        <div style="display: grid; grid-template-columns: 300px 1fr; gap: 2rem; margin-bottom: 3rem;">
            <div>
                <img src="${escort.photo}" alt="${escort.name}" style="width:100%; height:auto; border-radius: 8px;" onerror="if(!this.src.includes('placeholder')) this.src='https://via.placeholder.com/300x400?text=${escort.name}'">
                
                <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
                    <button class="btn btn-gold" style="flex: 1;" onclick="openPersonalBookingModal(${escort.id}, '${escort.name}')">Book Now</button>
                    <button class="btn btn-outline" style="flex: 1;" onclick="toggleChat()">Message</button>
                </div>
            </div>
            
            <div>
                <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 300; margin: 0;">${escort.name}</h1>
                    ${escort.verified ? '<span class="verified-badge" style="font-size: 0.8rem;">✓ Verified</span>' : ''}
                </div>
                
                <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem;">
                    <div><span style="color: var(--gold);">Age:</span> ${escort.age}</div>
                    <div><span style="color: var(--gold);">Height:</span> ${escort.height || 'N/A'}</div>
                    <div><span style="color: var(--gold);">Measurements:</span> ${escort.measurements || 'N/A'}</div>
                    <div><span style="color: var(--gold);">Weight:</span> ${escort.weight || 'N/A'}</div>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-bottom: 0.75rem;">About</h3>
                    <p style="color: var(--muted); line-height: 1.8;">${escort.longBio || escort.bio}</p>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-bottom: 0.75rem;">Specialties</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${escort.specialties ? escort.specialties.map(s => `<span class="escort-tag" style="background: var(--gold); color: var(--dark);">${s}</span>`).join('') : escort.tags.map(t => `<span class="escort-tag" style="background: var(--gold); color: var(--dark);">${t}</span>`).join('')}
                    </div>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-bottom: 0.75rem;">Languages</h3>
                    <p style="color: var(--muted);">${escort.languages ? escort.languages.join(' · ') : 'English'}</p>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-bottom: 0.75rem;">Availability</h3>
                    <p style="color: var(--muted);">${escort.availability || 'Contact for availability'}</p>
                </div>
            </div>
        </div>
        
        <!-- Rates & Contact -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem;">
            <div style="background: var(--white); padding: 2rem; border: 1px solid var(--border);">
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-bottom: 1.5rem;">Rates</h3>
                ${ratesHtml}
                <p style="font-size: 0.85rem; color: var(--muted); margin-top: 1rem;">*Rates are for reference only. Contact for exact pricing.</p>
            </div>
            
            <div style="background: var(--white); padding: 2rem; border: 1px solid var(--border);">
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-bottom: 1.5rem;">Contact</h3>
                ${contactHtml || '<p style="color: var(--muted);">Contact via main booking page</p>'}
                <div style="margin-top: 1.5rem;">
                    <a href="booking.html?escort=${escort.id}" class="btn btn-gold" style="width:100%; text-align: center;">Book via Website</a>
                </div>
            </div>
        </div>
        
        <!-- Gallery -->
        <div style="margin-bottom: 3rem;">
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-bottom: 1.5rem;">Gallery</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                ${galleryHtml}
            </div>
        </div>
        
        <!-- Reviews -->
        <div id="escort-reviews-section">
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-bottom: 1.5rem;">Client Reviews</h3>
            <div id="escort-reviews-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;"></div>
        </div>
    `;
}

function renderEscortReviews(escortId) {
    const d = getData();
    const reviewsGrid = document.getElementById('escort-reviews-grid');
    if (!reviewsGrid) return;
    
    const escortReviews = d.reviews.filter(r => r.escortId === escortId);
    
    if (escortReviews.length === 0) {
        reviewsGrid.innerHTML = '<p style="color: var(--muted); grid-column: span 2;">No reviews yet for this companion.</p>';
        return;
    }
    
    reviewsGrid.innerHTML = '';
    escortReviews.forEach(r => {
        const el = document.createElement('div');
        el.className = 'review-card';
        el.innerHTML = `<p class="review-text">${r.text}</p><div class="review-author">${r.name}</div><div class="review-source">${r.source}</div>`;
        reviewsGrid.appendChild(el);
    });
}

// Personal Booking Modal Functions
function openPersonalBookingModal(escortId, escortName) {
    const modal = document.getElementById('personal-booking-modal');
    if (!modal) return;
    
    document.getElementById('pb-escort-id').value = escortId;
    document.getElementById('pb-escort-name').value = escortName;
    document.getElementById('modal-escort-name').textContent = `Book with ${escortName}`;
    
    // Reset form
    document.getElementById('personal-booking-form').reset();
    document.getElementById('pb-form-error').style.display = 'none';
    document.getElementById('pb-form-success').classList.remove('show');
    
    modal.style.display = 'flex';
}

function closePersonalBookingModal() {
    const modal = document.getElementById('personal-booking-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Personal Booking Form Submission
async function submitPersonalBooking(e) {
    e.preventDefault();
    
    const d = getData();
    const ejs = d.site.emailjs || {};
    const btn = e.target.querySelector('button[type="submit"]');
    const errEl = document.getElementById('pb-form-error');
    const successEl = document.getElementById('pb-form-success');
    const escortId = document.getElementById('pb-escort-id').value;
    const escortName = document.getElementById('pb-escort-name').value;

    if (errEl) errEl.style.display = 'none';

    // Validate form fields
    const fname = document.getElementById('pb-fname');
    const lname = document.getElementById('pb-lname');
    const phone = document.getElementById('pb-phone');
    const email = document.getElementById('pb-email');
    
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

    if (btn) {
        btn.textContent = 'Sending…';
        btn.disabled = true;
    }

    try {
        // Store booking in localStorage
        const booking = {
            id: Date.now(),
            escortId: parseInt(escortId),
            escortName: escortName,
            firstName: fname.value.trim(),
            lastName: lname.value.trim(),
            phone: phone.value.trim(),
            email: email.value.trim(),
            date: document.getElementById('pb-date')?.value || '',
            time: document.getElementById('pb-time')?.value || '',
            message: document.getElementById('pb-message')?.value || '',
            timestamp: new Date().toISOString()
        };
        
        if (!d.bookings) d.bookings = [];
        d.bookings.push(booking);
        saveData(d);
        
        // Try to send email if configured
        if (ejs.serviceId && ejs.templateId && ejs.publicKey && ejs.recipientEmail) {
            try {
                if (typeof emailjs !== 'undefined') {
                    emailjs.init(ejs.publicKey);
                    
                    const params = {
                        to_email: ejs.recipientEmail,
                        from_name: fname.value.trim() + ' ' + lname.value.trim(),
                        from_email: email.value.trim(),
                        phone: phone.value.trim(),
                        escort: escortName,
                        date: document.getElementById('pb-date')?.value || 'Not specified',
                        time: document.getElementById('pb-time')?.value || 'Not specified',
                        message: document.getElementById('pb-message')?.value || 'No message',
                    };
                    
                    await emailjs.send(ejs.serviceId, ejs.templateId, params);
                }
            } catch (emailErr) {
                console.log('Email send failed but booking saved:', emailErr);
            }
        }
        
        // Show success
        if (successEl) successEl.classList.add('show');
        e.target.reset();
        if (btn) btn.style.display = 'none';
        
        // Close modal after 3 seconds
        setTimeout(() => {
            closePersonalBookingModal();
        }, 3000);
        
    } catch (err) {
        console.error('Booking error:', err);
        if (errEl) {
            errEl.style.display = 'block';
            errEl.textContent = '❌ Failed to submit booking. Please try again.';
        }
        if (btn) {
            btn.textContent = 'Send Booking Request';
            btn.disabled = false;
        }
    }
}