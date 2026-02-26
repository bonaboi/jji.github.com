// ============================================================
// ADMIN PANEL FUNCTIONALITY
// ============================================================

function openAdmin() {
    const overlay = document.getElementById('admin-overlay');
    if (overlay) {
        overlay.classList.add('open');
        renderAdminContent();
    }
}

function closeAdmin() {
    const overlay = document.getElementById('admin-overlay');
    if (overlay) {
        overlay.classList.remove('open');
    }
}

function handleAdminOverlay(e) {
    if (e.target === document.getElementById('admin-overlay')) {
        closeAdmin();
    }
}

function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
}

function adminLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    renderAdminContent();
}

function renderAdminContent() {
    const content = document.getElementById('adm-content');
    const logoutBtn = document.getElementById('adm-logout-btn');
    
    if (!content) return;
    
    if (!isLoggedIn()) {
        if (logoutBtn) logoutBtn.style.display = 'none';
        content.innerHTML = `<div class="adm-login">
            <p>Enter your admin password to access the dashboard.</p>
            <input class="adm-input" type="password" id="adm-pass" placeholder="Password" style="max-width:300px;display:block;margin:0 auto 0.75rem;" onkeydown="if(event.key==='Enter')doLogin()">
            <div class="adm-error" id="adm-err"></div>
            <button class="adm-btn" onclick="doLogin()">Login →</button>
        </div>`;
        setTimeout(() => {
            const p = document.getElementById('adm-pass');
            if (p) p.focus();
        }, 100);
        return;
    }
    
    if (logoutBtn) logoutBtn.style.display = '';
    
    content.innerHTML = `
        <div class="adm-tabs">
            <button class="adm-tab active" onclick="switchTab(this,'tab-site')">Site</button>
            <button class="adm-tab" onclick="switchTab(this,'tab-email')">Email</button>
            <button class="adm-tab" onclick="switchTab(this,'tab-escorts')">Companions</button>
            <button class="adm-tab" onclick="switchTab(this,'tab-services')">Services</button>
            <button class="adm-tab" onclick="switchTab(this,'tab-reviews')">Reviews</button>
            <button class="adm-tab" onclick="switchTab(this,'tab-images')">Images</button>
            <button class="adm-tab" onclick="switchTab(this,'tab-channels')">Channels</button>
            <button class="adm-tab" onclick="switchTab(this,'tab-certs')">Certificates</button>
            <button class="adm-tab" onclick="switchTab(this,'tab-chat')">Chatbot</button>
            <button class="adm-tab" onclick="switchTab(this,'tab-bookings')">Bookings</button>
        </div>
        <div class="adm-body">
            ${buildSiteTab()}
            ${buildEmailTab()}
            ${buildEscortsTab()}
            ${buildServicesTab()}
            ${buildReviewsTab()}
            ${buildImagesTab()}
            ${buildChannelsTab()}
            ${buildCertsTab()}
            ${buildChatTab()}
            ${buildBookingsTab()}
        </div>`;
}

function doLogin() {
    const passInput = document.getElementById('adm-pass');
    if (!passInput) return;
    
    const val = passInput.value;
    if (val === ADMIN_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        renderAdminContent();
    } else {
        const errEl = document.getElementById('adm-err');
        if (errEl) errEl.textContent = 'Incorrect password.';
        passInput.value = '';
    }
}

function switchTab(btn, id) {
    document.querySelectorAll('.adm-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.adm-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(id);
    if (panel) panel.classList.add('active');
}

// ============================================================
// ADMIN TABS BUILD FUNCTIONS
// ============================================================

// Site Tab - Enhanced with website name
function buildSiteTab() {
    const d = getData();
    const s = d.site;
    
    return `<div class="adm-panel active" id="tab-site">
        <div class="adm-section">
            <div class="adm-section-title">Website Identity</div>
            <div class="adm-group"><label>Website Name</label><input class="adm-input" id="s-name" value="${escapeHtml(s.name)}"></div>
            <div class="adm-group"><label>Browser Title</label><input class="adm-input" id="s-title" value="${escapeHtml(s.title)}"></div>
        </div>
        <div class="adm-section">
            <div class="adm-section-title">Business Info</div>
            <div class="adm-row">
                <div class="adm-group"><label>Tagline</label><input class="adm-input" id="s-tagline" value="${escapeHtml(s.tagline)}"></div>
                <div class="adm-group"><label>Phone Number</label><input class="adm-input" id="s-phone" value="${escapeHtml(s.phone)}"></div>
            </div>
            <div class="adm-row">
                <div class="adm-group"><label>Email (display only)</label><input class="adm-input" id="s-email" value="${escapeHtml(s.email)}"></div>
                <div class="adm-group"><label>Footer Copyright</label><input class="adm-input" id="s-footer" value="${escapeHtml(s.footerCopy)}"></div>
            </div>
        </div>
        <div class="adm-section">
            <div class="adm-section-title">Hero Text</div>
            <div class="adm-group"><label>Headline (use \\n for line break)</label><textarea class="adm-textarea" id="s-hero-h">${escapeHtml(s.heroHeadline)}</textarea></div>
            <div class="adm-group"><label>Subtext</label><textarea class="adm-textarea" id="s-hero-sub">${escapeHtml(s.heroSubtext)}</textarea></div>
        </div>
        <div class="adm-section">
            <div class="adm-section-title">Incall / Outcall</div>
            <div class="adm-row">
                <div class="adm-group"><label>Incall</label><textarea class="adm-textarea" id="s-incall">${escapeHtml(s.incallText)}</textarea></div>
                <div class="adm-group"><label>Outcall</label><textarea class="adm-textarea" id="s-outcall">${escapeHtml(s.outcallText)}</textarea></div>
            </div>
        </div>
        <div class="adm-section">
            <div class="adm-section-title">Other Text</div>
            <div class="adm-group"><label>Services Intro</label><textarea class="adm-textarea" id="s-svc-intro">${escapeHtml(s.servicesIntro)}</textarea></div>
            <div class="adm-row">
                <div class="adm-group"><label>CTA Headline</label><input class="adm-input" id="s-cta-h" value="${escapeHtml(s.ctaHeadline)}"></div>
                <div class="adm-group"><label>CTA Subtext</label><input class="adm-input" id="s-cta-sub" value="${escapeHtml(s.ctaSubtext)}"></div>
            </div>
            <div class="adm-group"><label>Booking Page Intro</label><textarea class="adm-textarea" id="s-book-intro">${escapeHtml(s.bookingIntro)}</textarea></div>
            <div class="adm-group"><label>Certification Page Intro</label><textarea class="adm-textarea" id="s-cert-intro">${escapeHtml(s.certIntro || '')}</textarea></div>
        </div>
        <div class="adm-section">
            <div class="adm-section-title">Brand Colors</div>
            <div class="color-row"><label>Gold / Accent</label><input type="color" class="color-picker" id="c-gold" value="${s.colors?.gold || '#b89a6a'}"></div>
            <div class="color-row"><label>Dark Background</label><input type="color" class="color-picker" id="c-dark" value="${s.colors?.dark || '#1a1410'}"></div>
            <div class="color-row"><label>Cream / Light BG</label><input type="color" class="color-picker" id="c-cream" value="${s.colors?.cream || '#f9f5ef'}"></div>
        </div>
        <button class="adm-save" onclick="saveSite()">Save Site Settings</button>
        <div class="adm-saved" id="saved-site">✓ Saved</div>
    </div>`;
}

function saveSite() {
    const d = getData();
    const s = d.site;
    
    s.name = getElementValue('s-name');
    s.title = getElementValue('s-title');
    s.tagline = getElementValue('s-tagline');
    s.phone = getElementValue('s-phone');
    s.email = getElementValue('s-email');
    s.footerCopy = getElementValue('s-footer');
    s.heroHeadline = getElementValue('s-hero-h');
    s.heroSubtext = getElementValue('s-hero-sub');
    s.incallText = getElementValue('s-incall');
    s.outcallText = getElementValue('s-outcall');
    s.servicesIntro = getElementValue('s-svc-intro');
    s.ctaHeadline = getElementValue('s-cta-h');
    s.ctaSubtext = getElementValue('s-cta-sub');
    s.bookingIntro = getElementValue('s-book-intro');
    s.certIntro = getElementValue('s-cert-intro');
    s.colors = {
        gold: getElementValue('c-gold'),
        dark: getElementValue('c-dark'),
        cream: getElementValue('c-cream')
    };
    
    saveData(d);
    renderAll();
    showFlashMessage('saved-site');
}

// Email Tab
function buildEmailTab() {
    const d = getData();
    const ejs = d.site.emailjs || {};
    
    const status = (ejs.serviceId && ejs.templateId && ejs.publicKey && ejs.recipientEmail) 
        ? '<span style="color:#4caf50;">✓ EmailJS is configured. Booking form is live.</span>'
        : '<span style="color:#e8a838;">⚠ Not fully configured yet. Fill all fields above.</span>';
    
    return `<div class="adm-panel" id="tab-email">
        <div class="adm-section">
            <div class="adm-section-title">EmailJS Configuration</div>
            <div class="ejs-info">
                <strong>How to set up EmailJS (free — 200 emails/month):</strong><br>
                1. Go to <a href="https://www.emailjs.com" target="_blank">emailjs.com</a> and create a free account<br>
                2. Add an <strong>Email Service</strong> (Gmail, Outlook, etc.) → copy the <strong>Service ID</strong><br>
                3. Create an <strong>Email Template</strong> — use these variables in your template:<br>
                   <code style="color:var(--gold-light);">{{from_name}}</code>, <code style="color:var(--gold-light);">{{from_email}}</code>, 
                <code style="color:var(--gold-light);">{{phone}}</code>, <code style="color:var(--gold-light);">{{service}}</code>, 
                <code style="color:var(--gold-light);">{{preferred_date}}</code>, <code style="color:var(--gold-light);">{{preferred_time}}</code>, 
                <code style="color:var(--gold-light);">{{message}}</code><br>
                4. Copy the <strong>Template ID</strong> and your <strong>Public Key</strong> (Account → API Keys)<br>
                5. Enter them below and save
            </div>
            <div class="adm-group"><label>Recipient Email (where bookings are sent)</label>
                <input class="adm-input" id="ejs-email" value="${escapeHtml(ejs.recipientEmail || '')}" placeholder="your@email.com" type="email">
            </div>
            <div class="adm-row">
                <div class="adm-group"><label>EmailJS Service ID</label>
                    <input class="adm-input" id="ejs-service" value="${escapeHtml(ejs.serviceId || '')}" placeholder="service_xxxxxxx">
                </div>
                <div class="adm-group"><label>EmailJS Template ID</label>
                    <input class="adm-input" id="ejs-template" value="${escapeHtml(ejs.templateId || '')}" placeholder="template_xxxxxxx">
                </div>
            </div>
            <div class="adm-group"><label>EmailJS Public Key</label>
                <input class="adm-input" id="ejs-pubkey" value="${escapeHtml(ejs.publicKey || '')}" placeholder="xxxxxxxxxxxxxxxxxxxxxx">
            </div>
        </div>
        <div style="background:rgba(184,154,106,0.06);border:1px solid rgba(184,154,106,0.15);padding:1rem;margin-bottom:1rem;font-size:0.8rem;color:rgba(249,245,239,0.5);line-height:1.7;">
            <strong style="color:var(--gold-light);">Status:</strong> ${status}
        </div>
        <button class="adm-save" onclick="saveEmailSettings()">Save Email Settings</button>
        <div class="adm-saved" id="saved-email">✓ Email settings saved</div>
    </div>`;
}

function saveEmailSettings() {
    const d = getData();
    d.site.emailjs = {
        recipientEmail: getElementValue('ejs-email'),
        serviceId: getElementValue('ejs-service'),
        templateId: getElementValue('ejs-template'),
        publicKey: getElementValue('ejs-pubkey')
    };
    saveData(d);
    showFlashMessage('saved-email');
    
    // Re-render admin content
    setTimeout(() => {
        renderAdminContent();
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 1) tabs[1].click();
    }, 400);
}

// Escorts Tab - Enhanced with personal details
function buildEscortsTab() {
    const d = getData();
    let list = '';
    
    d.escorts.forEach((e, i) => {
        list += `<div class="escort-list-item">
            <img class="escort-list-thumb" src="${e.photo}" onerror="if(!this.src.includes('placeholder')) this.src='https://via.placeholder.com/60x60?text=${e.name}'">
            <div class="escort-list-info">
                <h4>${escapeHtml(e.name)}${e.verified ? '<span class="adm-badge-mini">✓ Verified</span>' : ''}</h4>
                <p>Age ${e.age} · ${e.tags.join(', ')} · ${e.available ? '<span style="color:#4caf50">Visible</span>' : '<span style="color:#888">Hidden</span>'}</p>
            </div>
            <div class="escort-list-actions">
                <button class="adm-btn adm-btn-sm" onclick="editEscort(${i})">Edit</button>
                <button class="adm-btn adm-btn-danger adm-btn-sm" onclick="deleteEscort(${i})">Delete</button>
                <a href="escort-profile.html?id=${e.id}" class="adm-btn adm-btn-sm" target="_blank">View Page</a>
            </div>
        </div>`;
    });
    
    return `<div class="adm-panel" id="tab-escorts">
        <div class="adm-section">
            <div class="adm-section-title">Current Companions</div>
            ${list || '<p style="color:var(--muted);font-size:0.85rem;">No companions added yet.</p>'}
        </div>
        <div class="adm-section">
            <div class="adm-section-title">Add New Companion</div>
            <div class="adm-tabs" style="margin-bottom:1rem;">
                <button class="adm-tab-small active" onclick="showEscortTab('basic')">Basic Info</button>
                <button class="adm-tab-small" onclick="showEscortTab('personal')">Personal</button>
                <button class="adm-tab-small" onclick="showEscortTab('rates')">Rates</button>
                <button class="adm-tab-small" onclick="showEscortTab('contact')">Contact</button>
                <button class="adm-tab-small" onclick="showEscortTab('gallery')">Gallery</button>
            </div>
            
            <div id="escort-basic-tab">
                <div class="adm-row">
                    <div class="adm-group"><label>Name</label><input class="adm-input" id="ne-name" placeholder="First name"></div>
                    <div class="adm-group"><label>Age</label><input class="adm-input" type="number" id="ne-age" placeholder="25" min="18" max="99"></div>
                </div>
                <div class="adm-group"><label>Photo URL</label><input class="adm-input" id="ne-photo" placeholder="https://…"></div>
                <div class="adm-group"><label>Short Bio</label><textarea class="adm-textarea" id="ne-bio" placeholder="Short bio for homepage…"></textarea></div>
                <div class="adm-group"><label>Long Bio</label><textarea class="adm-textarea" id="ne-longbio" placeholder="Detailed bio for profile page…" style="min-height:100px;"></textarea></div>
                <div class="adm-group"><label>Tags (comma-separated)</label><input class="adm-input" id="ne-tags" placeholder="Swedish, Deep Tissue, Nuru"></div>
            </div>
            
            <div id="escort-personal-tab" style="display:none;">
                <div class="adm-group"><label>Specialties (comma-separated)</label><input class="adm-input" id="ne-specialties" placeholder="Sensual Massage, Body-to-Body, Happy Ending"></div>
                <div class="adm-group"><label>Languages (comma-separated)</label><input class="adm-input" id="ne-languages" placeholder="English, Spanish"></div>
                <div class="adm-row">
                    <div class="adm-group"><label>Measurements</label><input class="adm-input" id="ne-measurements" placeholder="34C-26-36"></div>
                    <div class="adm-group"><label>Height</label><input class="adm-input" id="ne-height" placeholder="5'6&quot; (168cm)"></div>
                </div>
                <div class="adm-row">
                    <div class="adm-group"><label>Weight</label><input class="adm-input" id="ne-weight" placeholder="125 lbs (57kg)"></div>
                    <div class="adm-group"><label>Availability</label><input class="adm-input" id="ne-availability" placeholder="Mon-Fri: 10am-8pm"></div>
                </div>
            </div>
            
            <div id="escort-rates-tab" style="display:none;">
                <div class="adm-row">
                    <div class="adm-group"><label>Incall 30min</label><input class="adm-input" id="ne-rate-incall30" placeholder="150"></div>
                    <div class="adm-group"><label>Incall 60min</label><input class="adm-input" id="ne-rate-incall60" placeholder="250"></div>
                </div>
                <div class="adm-row">
                    <div class="adm-group"><label>Incall 90min</label><input class="adm-input" id="ne-rate-incall90" placeholder="350"></div>
                    <div class="adm-group"><label>Outcall 60min</label><input class="adm-input" id="ne-rate-outcall60" placeholder="300"></div>
                </div>
                <div class="adm-row">
                    <div class="adm-group"><label>Outcall 90min</label><input class="adm-input" id="ne-rate-outcall90" placeholder="400"></div>
                    <div class="adm-group"><label>Overnight</label><input class="adm-input" id="ne-rate-overnight" placeholder="1200"></div>
                </div>
            </div>
            
            <div id="escort-contact-tab" style="display:none;">
                <div class="adm-group"><label>Signal</label><input class="adm-input" id="ne-contact-signal" placeholder="@username"></div>
                <div class="adm-group"><label>Telegram</label><input class="adm-input" id="ne-contact-telegram" placeholder="@username"></div>
                <div class="adm-group"><label>WhatsApp</label><input class="adm-input" id="ne-contact-whatsapp" placeholder="+1 (000) 000-0000"></div>
                <div class="adm-group"><label>Discord</label><input class="adm-input" id="ne-contact-discord" placeholder="username#0000"></div>
            </div>
            
            <div id="escort-gallery-tab" style="display:none;">
                <div class="adm-group"><label>Gallery Images (URLs, one per line)</label><textarea class="adm-textarea" id="ne-gallery" placeholder="https://...&#10;https://...&#10;https://..." style="min-height:100px;"></textarea></div>
            </div>
            
            <div style="display:flex;gap:2rem;margin:1rem 0;">
                <label class="adm-check-label"><input type="checkbox" class="adm-check" id="ne-verified"> Verified Badge ✓</label>
                <label class="adm-check-label"><input type="checkbox" class="adm-check" id="ne-available" checked> Show on Site</label>
                <label class="adm-check-label"><input type="checkbox" class="adm-check" id="ne-featured"> Featured</label>
            </div>
            
            <button class="adm-btn" onclick="addEscort()">+ Add Companion</button>
        </div>
        <div class="adm-saved" id="saved-escorts">✓ Saved</div>
    </div>`;
}

// Add this function to handle escort tab switching
function showEscortTab(tabName) {
    document.querySelectorAll('[id^="escort-"]').forEach(el => {
        if (el.id && el.id.endsWith('-tab')) {
            el.style.display = 'none';
        }
    });
    document.getElementById(`escort-${tabName}-tab`).style.display = 'block';
    
    document.querySelectorAll('.adm-tab-small').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
}

function addEscort() {
    const d = getData();
    const name = getElementValue('ne-name').trim();
    
    if (!name) return alert('Name is required.');
    
    // Build gallery array
    const galleryText = getElementValue('ne-gallery');
    const gallery = galleryText ? galleryText.split('\n').map(url => url.trim()).filter(url => url) : [];
    
    // Build rates object
    const rates = {};
    const incall30 = getElementValue('ne-rate-incall30');
    const incall60 = getElementValue('ne-rate-incall60');
    const incall90 = getElementValue('ne-rate-incall90');
    const outcall60 = getElementValue('ne-rate-outcall60');
    const outcall90 = getElementValue('ne-rate-outcall90');
    const overnight = getElementValue('ne-rate-overnight');
    
    if (incall30) rates.incall30 = incall30;
    if (incall60) rates.incall60 = incall60;
    if (incall90) rates.incall90 = incall90;
    if (outcall60) rates.outcall60 = outcall60;
    if (outcall90) rates.outcall90 = outcall90;
    if (overnight) rates.overnight = overnight;
    
    // Build contact object
    const contact = {};
    const signal = getElementValue('ne-contact-signal');
    const telegram = getElementValue('ne-contact-telegram');
    const whatsapp = getElementValue('ne-contact-whatsapp');
    const discord = getElementValue('ne-contact-discord');
    
    if (signal) contact.signal = signal;
    if (telegram) contact.telegram = telegram;
    if (whatsapp) contact.whatsapp = whatsapp;
    if (discord) contact.discord = discord;
    
    d.escorts.push({
        id: Date.now(),
        name,
        age: parseInt(getElementValue('ne-age')) || 25,
        bio: getElementValue('ne-bio'),
        longBio: getElementValue('ne-longbio') || getElementValue('ne-bio'),
        tags: getElementValue('ne-tags').split(',').map(t => t.trim()).filter(Boolean),
        specialties: getElementValue('ne-specialties').split(',').map(s => s.trim()).filter(Boolean),
        languages: getElementValue('ne-languages').split(',').map(l => l.trim()).filter(Boolean),
        measurements: getElementValue('ne-measurements'),
        height: getElementValue('ne-height'),
        weight: getElementValue('ne-weight'),
        availability: getElementValue('ne-availability'),
        rates: Object.keys(rates).length ? rates : null,
        contact: Object.keys(contact).length ? contact : null,
        photo: getElementValue('ne-photo') || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
        gallery: gallery.length ? gallery : null,
        verified: document.getElementById('ne-verified') ? document.getElementById('ne-verified').checked : false,
        available: document.getElementById('ne-available') ? document.getElementById('ne-available').checked : true,
        featured: document.getElementById('ne-featured') ? document.getElementById('ne-featured').checked : false
    });
    
    saveData(d);
    renderAll();
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 2) tabs[2].click();
    }, 50);
}

function deleteEscort(i) {
    if (!confirm('Delete this companion?')) return;
    
    const d = getData();
    d.escorts.splice(i, 1);
    saveData(d);
    renderAll();
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 2) tabs[2].click();
    }, 50);
}

function editEscort(i) {
    const d = getData();
    const e = d.escorts[i];
    
    // Simple edit for now - can be enhanced with a modal
    const n = prompt('Name:', e.name);
    if (n !== null) e.name = n;
    
    const a = prompt('Age:', e.age);
    if (a !== null) e.age = parseInt(a) || e.age;
    
    const ph = prompt('Photo URL:', e.photo);
    if (ph !== null) e.photo = ph;
    
    const tg = prompt('Tags (comma-separated):', e.tags.join(', '));
    if (tg !== null) e.tags = tg.split(',').map(t => t.trim()).filter(Boolean);
    
    e.verified = confirm('Show verification badge? (OK = Yes, Cancel = No)');
    e.available = confirm('Show on site? (OK = Yes, Cancel = No)');
    
    saveData(d);
    renderAll();
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 2) tabs[2].click();
    }, 50);
}

// Services Tab
function buildServicesTab() {
    const d = getData();
    let list = '';
    
    d.services.forEach((s, i) => {
        list += `<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(184,154,106,0.1);padding:1rem;margin-bottom:0.5rem;display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:start;">
            <div>
                <div class="adm-group" style="margin-bottom:0.5rem;"><label>Name</label><input class="adm-input" id="sv-n-${i}" value="${escapeHtml(s.name)}"></div>
                <div class="adm-group" style="margin-bottom:0;"><label>Description</label><textarea class="adm-textarea" id="sv-d-${i}" style="min-height:55px;">${escapeHtml(s.desc)}</textarea></div>
            </div>
            <button class="adm-btn adm-btn-danger adm-btn-sm" style="margin-top:1.4rem;" onclick="deleteSvc(${i})">✕</button>
        </div>`;
    });
    
    return `<div class="adm-panel" id="tab-services">
        <div class="adm-section"><div class="adm-section-title">Edit Services</div>${list}</div>
        <div class="adm-section"><div class="adm-section-title">Add New Service</div>
            <div class="adm-group"><label>Name</label><input class="adm-input" id="ns-n" placeholder="e.g. Body Scrub"></div>
            <div class="adm-group"><label>Description</label><textarea class="adm-textarea" id="ns-d" placeholder="Service description…"></textarea></div>
            <button class="adm-btn" onclick="addSvc()">+ Add Service</button>
        </div>
        <button class="adm-save" onclick="saveSvcs()">Save All Services</button>
        <div class="adm-saved" id="saved-svcs">✓ Saved</div>
    </div>`;
}

function saveSvcs() {
    const d = getData();
    d.services.forEach((s, i) => {
        s.name = getElementValue(`sv-n-${i}`);
        s.desc = getElementValue(`sv-d-${i}`);
    });
    saveData(d);
    renderAll();
    showFlashMessage('saved-svcs');
}

function addSvc() {
    const d = getData();
    d.services.push({
        name: getElementValue('ns-n'),
        desc: getElementValue('ns-d')
    });
    saveData(d);
    renderAll();
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 3) tabs[3].click();
    }, 50);
}

function deleteSvc(i) {
    const d = getData();
    d.services.splice(i, 1);
    saveData(d);
    renderAll();
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 3) tabs[3].click();
    }, 50);
}

// Reviews Tab - Enhanced with escort selection
function buildReviewsTab() {
    const d = getData();
    let list = '';
    const escortOptions = d.escorts.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
    
    d.reviews.forEach((r, i) => {
        list += `<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(184,154,106,0.1);padding:1rem;margin-bottom:0.5rem;display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:start;">
            <div>
                <div class="adm-row">
                    <div class="adm-group"><label>Name</label><input class="adm-input" id="rv-n-${i}" value="${escapeHtml(r.name)}"></div>
                    <div class="adm-group"><label>Source</label><input class="adm-input" id="rv-s-${i}" value="${escapeHtml(r.source)}"></div>
                </div>
                <div class="adm-group"><label>For Escort</label>
                    <select class="adm-select" id="rv-e-${i}">
                        <option value="">General Review</option>
                        ${d.escorts.map(e => `<option value="${e.id}" ${r.escortId === e.id ? 'selected' : ''}>${e.name}</option>`).join('')}
                    </select>
                </div>
                <div class="adm-group" style="margin-bottom:0;"><label>Review Text</label><textarea class="adm-textarea" id="rv-t-${i}" style="min-height:65px;">${escapeHtml(r.text)}</textarea></div>
            </div>
            <button class="adm-btn adm-btn-danger adm-btn-sm" style="margin-top:1.4rem;" onclick="deleteReview(${i})">✕</button>
        </div>`;
    });
    
    return `<div class="adm-panel" id="tab-reviews">
        <div class="adm-section"><div class="adm-section-title">Edit Reviews</div>${list}</div>
        <div class="adm-section"><div class="adm-section-title">Add New Review</div>
            <div class="adm-row">
                <div class="adm-group"><label>Name</label><input class="adm-input" id="nr-n" placeholder="Client name"></div>
                <div class="adm-group"><label>Source</label><input class="adm-input" id="nr-s" placeholder="Verified Client"></div>
            </div>
            <div class="adm-group"><label>For Escort</label>
                <select class="adm-select" id="nr-e">
                    <option value="">General Review</option>
                    ${escortOptions}
                </select>
            </div>
            <div class="adm-group"><label>Review Text</label><textarea class="adm-textarea" id="nr-t" placeholder="What they said…"></textarea></div>
            <button class="adm-btn" onclick="addReview()">+ Add Review</button>
        </div>
        <button class="adm-save" onclick="saveReviews()">Save All Reviews</button>
        <div class="adm-saved" id="saved-reviews">✓ Saved</div>
    </div>`;
}

function saveReviews() {
    const d = getData();
    d.reviews.forEach((r, i) => {
        r.name = getElementValue(`rv-n-${i}`);
        r.source = getElementValue(`rv-s-${i}`);
        r.text = getElementValue(`rv-t-${i}`);
        const escortId = getElementValue(`rv-e-${i}`);
        if (escortId) {
            r.escortId = parseInt(escortId);
        } else {
            delete r.escortId;
        }
    });
    saveData(d);
    renderAll();
    showFlashMessage('saved-reviews');
}

function addReview() {
    const d = getData();
    const escortId = getElementValue('nr-e');
    const review = {
        name: getElementValue('nr-n'),
        source: getElementValue('nr-s') || 'Verified Client',
        text: getElementValue('nr-t')
    };
    if (escortId) {
        review.escortId = parseInt(escortId);
    }
    d.reviews.push(review);
    saveData(d);
    renderAll();
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 4) tabs[4].click();
    }, 50);
}

function deleteReview(i) {
    const d = getData();
    d.reviews.splice(i, 1);
    saveData(d);
    renderAll();
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 4) tabs[4].click();
    }, 50);
}

// Images Tab
const IMG_LABELS = {
    hero: 'Hero Image',
    g1: 'Gallery — Large Feature',
    g2: 'Gallery — Top Middle',
    g3: 'Gallery — Top Right',
    g4: 'Gallery — Bottom Middle',
    g5: 'Gallery — Bottom Right'
};

const IMG_DEFAULTS = {
    hero: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80',
    g1: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    g2: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80',
    g3: 'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=600&q=80',
    g4: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80',
    g5: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80'
};

function buildImagesTab() {
    const d = getData();
    let rows = '';
    
    for (const [k, label] of Object.entries(IMG_LABELS)) {
        const url = d.images[k] || '';
        rows += `<div class="adm-img-row">
            <img class="adm-img-prev" id="iprev-${k}" src="${url}" onerror="this.style.opacity=0.2">
            <div>
                <div class="adm-img-label">${label}</div>
                <input class="adm-input" id="iurl-${k}" value="${escapeHtml(url)}" placeholder="Paste image URL…" oninput="previewImg('${k}')">
            </div>
            <button class="adm-reset-btn" onclick="resetImg('${k}')" title="Reset">↺</button>
        </div>`;
    }
    
    return `<div class="adm-panel" id="tab-images">
        <div class="adm-section">
            <div class="adm-section-title">Site Images</div>
            <p style="font-size:0.78rem;color:rgba(249,245,239,0.4);margin-bottom:1.25rem;line-height:1.7;">Paste any public image URL.</p>
            ${rows}
        </div>
        <button class="adm-save" onclick="saveImages()">Save All Images</button>
        <div class="adm-saved" id="saved-images">✓ Saved</div>
    </div>`;
}

function previewImg(k) {
    const url = getElementValue(`iurl-${k}`);
    const prev = document.getElementById(`iprev-${k}`);
    if (prev) {
        prev.style.opacity = 1;
        prev.src = url;
    }
}

function resetImg(k) {
    const el = document.getElementById(`iurl-${k}`);
    if (el) el.value = IMG_DEFAULTS[k] || '';
    previewImg(k);
}

function saveImages() {
    const d = getData();
    for (const k of Object.keys(IMG_LABELS)) {
        d.images[k] = getElementValue(`iurl-${k}`);
    }
    saveData(d);
    renderAll();
    showFlashMessage('saved-images');
}

// Channels Tab
function buildChannelsTab() {
    const d = getData();
    let rows = '';
    
    d.channels.forEach((c, i) => {
        rows += `<div style="display:grid;grid-template-columns:60px 1fr 1fr auto;gap:0.75rem;align-items:end;margin-bottom:0.75rem;background:rgba(255,255,255,0.03);padding:1rem;border:1px solid rgba(184,154,106,0.1);">
            <div class="adm-group" style="margin:0;"><label>Icon</label><input class="adm-input" id="ch-i-${i}" value="${escapeHtml(c.icon)}"></div>
            <div class="adm-group" style="margin:0;"><label>Platform</label><input class="adm-input" id="ch-n-${i}" value="${escapeHtml(c.name)}"></div>
            <div class="adm-group" style="margin:0;"><label>Handle</label><input class="adm-input" id="ch-v-${i}" value="${escapeHtml(c.value)}"></div>
            <button class="adm-btn adm-btn-danger adm-btn-sm" onclick="deleteChan(${i})">✕</button>
        </div>`;
    });
    
    return `<div class="adm-panel" id="tab-channels">
        <div class="adm-section"><div class="adm-section-title">Contact Channels</div>${rows}</div>
        <div class="adm-section"><div class="adm-section-title">Add Channel</div>
            <div style="display:grid;grid-template-columns:60px 1fr 1fr;gap:0.75rem;margin-bottom:0.75rem;">
                <div class="adm-group"><label>Icon</label><input class="adm-input" id="nc-i" placeholder="📱"></div>
                <div class="adm-group"><label>Platform</label><input class="adm-input" id="nc-n" placeholder="Telegram"></div>
                <div class="adm-group"><label>Handle</label><input class="adm-input" id="nc-v" placeholder="@handle"></div>
            </div>
            <button class="adm-btn" onclick="addChan()">+ Add Channel</button>
        </div>
        <button class="adm-save" onclick="saveChanls()">Save Channels</button>
        <div class="adm-saved" id="saved-chans">✓ Saved</div>
    </div>`;
}

function saveChanls() {
    const d = getData();
    d.channels.forEach((c, i) => {
        c.icon = getElementValue(`ch-i-${i}`);
        c.name = getElementValue(`ch-n-${i}`);
        c.value = getElementValue(`ch-v-${i}`);
    });
    saveData(d);
    renderAll();
    showFlashMessage('saved-chans');
}

function addChan() {
    const d = getData();
    d.channels.push({
        icon: getElementValue('nc-i') || '📱',
        name: getElementValue('nc-n'),
        value: getElementValue('nc-v')
    });
    saveData(d);
    renderAll();
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 6) tabs[6].click();
    }, 50);
}

function deleteChan(i) {
    const d = getData();
    d.channels.splice(i, 1);
    saveData(d);
    renderAll();
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 6) tabs[6].click();
    }, 50);
}

// Certificates Tab
let certImageData = '';

function buildCertsTab() {
    const d = getData();
    let list = '';
    
    (d.certs || []).forEach((c, i) => {
        list += `<div class="cert-list-item">
            <div style="width:80px;height:60px;background:rgba(255,255,255,0.05);border:1px solid rgba(184,154,106,0.2);overflow:hidden;display:flex;align-items:center;justify-content:center;">
                ${c.image ? `<img src="${c.image}" style="width:100%;height:100%;object-fit:cover;" onerror="if(!this.src.includes('placeholder')) this.src='https://via.placeholder.com/80x60?text=Cert'">` : '<span style="font-size:1.5rem;">📜</span>'}
            </div>
            <div class="cert-list-info">
                <h4>${escapeHtml(c.title)}</h4>
                <p>${escapeHtml(c.issuer || '')}${c.date ? ' · ' + escapeHtml(c.date) : ''}</p>
            </div>
            <button class="adm-btn adm-btn-danger adm-btn-sm" onclick="deleteCert(${i})">Delete</button>
        </div>`;
    });
    
    return `<div class="adm-panel" id="tab-certs">
        <div class="adm-section"><div class="adm-section-title">Current Certificates (${(d.certs || []).length})</div>
            ${list || '<p style="color:var(--muted);font-size:0.85rem;">No certificates uploaded yet.</p>'}
        </div>
        <div class="adm-section"><div class="adm-section-title">Upload / Add New Certificate</div>
            <p style="font-size:0.78rem;color:rgba(249,245,239,0.4);margin-bottom:1rem;line-height:1.7;">Upload an image file from your device, or paste an image URL.</p>
            <div class="cert-upload-area" id="cert-drop-zone" onclick="document.getElementById('cert-file-inp').click()" 
                ondragover="event.preventDefault();this.classList.add('drag')" 
                ondragleave="this.classList.remove('drag')" 
                ondrop="handleCertDrop(event)">
                <div style="font-size:2rem;">📎</div>
                <p>Click to choose a file, or drag & drop here</p>
                <p style="font-size:0.72rem;margin-top:0.25rem;">JPG, PNG, PDF previews supported</p>
            </div>
            <input type="file" id="cert-file-inp" accept="image/*" style="display:none;" onchange="handleCertFile(event)">
            <div id="cert-preview-wrap" style="display:none;margin-bottom:1rem;">
                <img id="cert-preview-img" style="max-width:200px;max-height:140px;object-fit:contain;border:1px solid rgba(184,154,106,0.2);margin-bottom:0.75rem;">
            </div>
            <div class="adm-row">
                <div class="adm-group"><label>Certificate Title *</label><input class="adm-input" id="nc-title" placeholder="e.g. Licensed Massage Therapist"></div>
                <div class="adm-group"><label>Issuing Body</label><input class="adm-input" id="nc-issuer" placeholder="e.g. NCBTMB"></div>
            </div>
            <div class="adm-row">
                <div class="adm-group"><label>Date Issued</label><input class="adm-input" type="date" id="nc-date"></div>
                <div class="adm-group"><label>Or paste image URL instead</label><input class="adm-input" id="nc-url" placeholder="https://…" oninput="certUrlPreview()"></div>
            </div>
            <div class="adm-group"><label>Description (optional)</label><textarea class="adm-textarea" id="nc-desc" placeholder="Brief description…" style="min-height:55px;"></textarea></div>
            <button class="adm-btn" onclick="addCert()">+ Add Certificate</button>
        </div>
        <div class="adm-saved" id="saved-certs">✓ Certificate added</div>
    </div>`;
}

function handleCertFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        certImageData = e.target.result;
        const previewImg = document.getElementById('cert-preview-img');
        if (previewImg) previewImg.src = certImageData;
        
        const previewWrap = document.getElementById('cert-preview-wrap');
        if (previewWrap) previewWrap.style.display = 'block';
        
        const dropZone = document.getElementById('cert-drop-zone');
        if (dropZone) {
            const p = dropZone.querySelector('p');
            if (p) p.textContent = '✓ File loaded: ' + file.name;
        }
    };
    reader.readAsDataURL(file);
}

function handleCertDrop(event) {
    event.preventDefault();
    const dropZone = document.getElementById('cert-drop-zone');
    if (dropZone) dropZone.classList.remove('drag');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const inp = document.getElementById('cert-file-inp');
        if (inp) {
            const dt = new DataTransfer();
            dt.items.add(file);
            inp.files = dt.files;
            handleCertFile({ target: inp });
        }
    }
}

function certUrlPreview() {
    const url = getElementValue('nc-url');
    if (url) {
        certImageData = url;
        const previewImg = document.getElementById('cert-preview-img');
        if (previewImg) previewImg.src = url;
        
        const previewWrap = document.getElementById('cert-preview-wrap');
        if (previewWrap) previewWrap.style.display = 'block';
    }
}

function addCert() {
    const title = getElementValue('nc-title').trim();
    if (!title) return alert('Certificate title is required.');
    
    const d = getData();
    if (!d.certs) d.certs = [];
    
    d.certs.push({
        id: Date.now(),
        title,
        issuer: getElementValue('nc-issuer'),
        date: getElementValue('nc-date'),
        desc: getElementValue('nc-desc'),
        image: certImageData || getElementValue('nc-url') || ''
    });
    
    certImageData = '';
    saveData(d);
    renderAll();
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 7) tabs[7].click();
    }, 50);
}

function deleteCert(i) {
    if (!confirm('Delete this certificate?')) return;
    
    const d = getData();
    d.certs.splice(i, 1);
    saveData(d);
    renderAll();
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 7) tabs[7].click();
    }, 50);
}

// Chat Tab
function buildChatTab() {
    const d = getData();
    const s = d.site;
    let faqs = '';
    
    (d.chatFAQ || []).forEach((f, i) => {
        faqs += `<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(184,154,106,0.1);padding:0.9rem;margin-bottom:0.5rem;display:grid;grid-template-columns:1fr auto;gap:1rem;">
            <div>
                <div class="adm-group" style="margin-bottom:0.4rem;"><label>Question</label><input class="adm-input" id="fq-q-${i}" value="${escapeHtml(f.q)}"></div>
                <div class="adm-group" style="margin-bottom:0;"><label>Answer</label><textarea class="adm-textarea" id="fq-a-${i}" style="min-height:50px;">${escapeHtml(f.a)}</textarea></div>
            </div>
            <button class="adm-btn adm-btn-danger adm-btn-sm" style="margin-top:1.4rem;" onclick="deleteFAQ(${i})">✕</button>
        </div>`;
    });
    
    return `<div class="adm-panel" id="tab-chat">
        <div class="adm-section"><div class="adm-section-title">Bot Settings</div>
            <div class="adm-row">
                <div class="adm-group"><label>Bot Name</label><input class="adm-input" id="ct-n" value="${escapeHtml(s.botName || 'Serenity Assistant')}"></div>
                <div class="adm-group"><label>Welcome Message</label><input class="adm-input" id="ct-w" value="${escapeHtml(s.botWelcome || '')}"></div>
            </div>
        </div>
        <div class="adm-section"><div class="adm-section-title">FAQ / Auto-Responses</div>
            <p style="font-size:0.78rem;color:rgba(249,245,239,0.4);margin-bottom:1rem;line-height:1.7;">Bot matches keywords from questions to auto-reply.</p>
            ${faqs}
        </div>
        <div class="adm-section"><div class="adm-section-title">Add FAQ</div>
            <div class="adm-group"><label>Question</label><input class="adm-input" id="nfq-q" placeholder="e.g. What services do you offer?"></div>
            <div class="adm-group"><label>Answer</label><textarea class="adm-textarea" id="nfq-a" placeholder="Bot response…"></textarea></div>
            <button class="adm-btn" onclick="addFAQ()">+ Add FAQ</button>
        </div>
        <button class="adm-save" onclick="saveChatSettings()">Save Chat Settings</button>
        <div class="adm-saved" id="saved-chat">✓ Saved</div>
    </div>`;
}

function saveChatSettings() {
    const d = getData();
    d.site.botName = getElementValue('ct-n');
    d.site.botWelcome = getElementValue('ct-w');
    
    (d.chatFAQ || []).forEach((f, i) => {
        f.q = getElementValue(`fq-q-${i}`);
        f.a = getElementValue(`fq-a-${i}`);
    });
    
    saveData(d);
    
    const botNameEl = document.getElementById('chat-bot-name');
    if (botNameEl) botNameEl.textContent = d.site.botName;
    
    window.chatStarted = false;
    showFlashMessage('saved-chat');
}

function addFAQ() {
    const d = getData();
    if (!d.chatFAQ) d.chatFAQ = [];
    
    d.chatFAQ.push({
        q: getElementValue('nfq-q'),
        a: getElementValue('nfq-a')
    });
    
    saveData(d);
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 8) tabs[8].click();
    }, 50);
}

function deleteFAQ(i) {
    const d = getData();
    d.chatFAQ.splice(i, 1);
    saveData(d);
    renderAdminContent();
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 8) tabs[8].click();
    }, 50);
}

// Bookings Tab (New)
function buildBookingsTab() {
    const d = getData();
    const bookings = d.bookings || [];
    
    let bookingsHtml = '';
    if (bookings.length === 0) {
        bookingsHtml = '<p style="color:var(--muted);">No bookings yet.</p>';
    } else {
        bookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        bookings.forEach((b, i) => {
            bookingsHtml += `<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(184,154,106,0.1);padding:1rem;margin-bottom:0.5rem;">
                <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
                    <strong>${b.firstName} ${b.lastName}</strong>
                    <span style="color:var(--gold-light);">${new Date(b.timestamp).toLocaleString()}</span>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.85rem;">
                    <div><span style="color:var(--muted);">Email:</span> ${b.email}</div>
                    <div><span style="color:var(--muted);">Phone:</span> ${b.phone}</div>
                    ${b.escortName ? `<div><span style="color:var(--muted);">Escort:</span> ${b.escortName}</div>` : ''}
                    ${b.service ? `<div><span style="color:var(--muted);">Service:</span> ${b.service}</div>` : ''}
                    ${b.date ? `<div><span style="color:var(--muted);">Date:</span> ${b.date}</div>` : ''}
                    ${b.time ? `<div><span style="color:var(--muted);">Time:</span> ${b.time}</div>` : ''}
                </div>
                ${b.message ? `<div style="margin-top:0.5rem;"><span style="color:var(--muted);">Message:</span> ${b.message}</div>` : ''}
            </div>`;
        });
    }
    
    return `<div class="adm-panel" id="tab-bookings">
        <div class="adm-section">
            <div class="adm-section-title">All Bookings (${bookings.length})</div>
            ${bookingsHtml}
        </div>
        <button class="adm-btn adm-btn-danger" onclick="clearAllBookings()" style="margin-top:1rem;">Clear All Bookings</button>
        <div class="adm-saved" id="saved-bookings">✓ Cleared</div>
    </div>`;
}

function clearAllBookings() {
    if (!confirm('Delete all booking records? This cannot be undone.')) return;
    
    const d = getData();
    d.bookings = [];
    saveData(d);
    renderAdminContent();
    showFlashMessage('saved-bookings');
    
    setTimeout(() => {
        const tabs = document.querySelectorAll('.adm-tab');
        if (tabs.length > 9) tabs[9].click();
    }, 50);
}