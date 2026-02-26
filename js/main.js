// ============================================================
// MAIN APPLICATION - PAGE MANAGEMENT & RENDERING
// ============================================================

// Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('open');
    }
}

// Lightbox
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.add('open');
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('open');
    }
}

// Render all site content
function renderAll() {
    renderSite();
    renderEscorts();
    renderServices();
    renderReviews();
    renderBookingPage();
    renderCertPage();
}

function renderSite() {
    const d = getData();
    const s = d.site;
    
    // Set document title
    document.title = s.title || s.name + ' – Massage & Wellness';
    
    // Update logo/website name everywhere
    const logoElements = document.querySelectorAll('.nav-logo');
    logoElements.forEach(el => {
        if (el) {
            const span = el.querySelector('span');
            if (span) {
                el.innerHTML = s.name.replace('Spa', '<span>Spa</span>');
            } else {
                el.textContent = s.name;
            }
        }
    });
    
    // Update site title in head
    const titleEl = document.getElementById('site-title');
    if (titleEl) titleEl.textContent = s.title || s.name;
    
    setTextContent('hero-eyebrow-text', s.tagline);
    
    const heroEl = document.getElementById('hero-headline');
    if (heroEl) {
        heroEl.innerHTML = s.heroHeadline.replace(/\n/g, '<br>').replace('refresh', '<em>refresh</em>');
    }
    
    setTextContent('hero-subtext', s.heroSubtext);
    setTextContent('incall-text', s.incallText);
    setTextContent('outcall-text', s.outcallText);
    setTextContent('services-intro-text', s.servicesIntro);
    setTextContent('cta-headline', s.ctaHeadline);
    setTextContent('cta-subtext', s.ctaSubtext);
    setTextContent('footer-copy', s.footerCopy);
    setTextContent('booking-intro-text', s.bookingIntro);
    setTextContent('cert-intro-text', s.certIntro);
    setTextContent('chat-bot-name', s.botName || 'Serenity Assistant');
    
    // Update phone number
    const phoneEl = document.getElementById('nav-phone-display');
    if (phoneEl) {
        phoneEl.innerHTML = `<a href="tel:${s.phone}">${s.phone}</a>`;
    }
    
    // Update images
    const imgs = d.images;
    ['hero', 'g1', 'g2', 'g3', 'g4', 'g5'].forEach(k => {
        const el = document.getElementById('img-' + k);
        if (el && imgs[k]) {
            el.src = imgs[k];
        }
    });
    
    // Update colors
    if (s.colors) {
        document.documentElement.style.setProperty('--gold', s.colors.gold || '#b89a6a');
        document.documentElement.style.setProperty('--dark', s.colors.dark || '#1a1410');
        document.documentElement.style.setProperty('--cream', s.colors.cream || '#f9f5ef');
    }
}

function setTextContent(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function renderEscorts() {
    const d = getData();
    const grid = document.getElementById('escorts-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    d.escorts.filter(e => e.available).forEach(e => {
        const card = document.createElement('div');
        card.className = 'escort-card';
        card.innerHTML = `
            <img class="escort-card-img" src="${e.photo}" alt="${e.name}" onerror="if(!this.src.includes('placeholder')) this.src='https://via.placeholder.com/400x500?text=${e.name}'">
            <div class="escort-card-body">
                <div class="escort-name">${e.name}${e.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}</div>
                <div class="escort-age">Age ${e.age} · Available Now</div>
                <div class="escort-tags">${e.tags.map(t => `<span class="escort-tag">${t}</span>`).join('')}</div>
                <p style="font-size:0.85rem;color:var(--muted);line-height:1.7;margin-bottom:1.25rem;">${e.bio}</p>
                <div class="escort-card-actions">
                    <a href="escort-profile.html?id=${e.id}" class="btn btn-gold" style="padding:0.6rem 1.2rem;font-size:0.65rem;">View Profile</a>
                    <button class="btn btn-outline" onclick="openPersonalBookingModal(${e.id}, '${e.name}')" style="padding:0.6rem 1.2rem;font-size:0.65rem;">Book Now</button>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

function renderServices() {
    const d = getData();
    const grid = document.getElementById('services-grid');
    if (grid) {
        grid.innerHTML = '';
        d.services.forEach(s => {
            const el = document.createElement('div');
            el.className = 'service-card';
            el.innerHTML = `<h3>${s.name}</h3><p>${s.desc}</p>`;
            grid.appendChild(el);
        });
    }
    
    // Update booking form select
    const sel = document.getElementById('bf-service');
    if (sel) {
        sel.innerHTML = '<option value="">Select a service…</option>';
        d.services.forEach(s => {
            const o = document.createElement('option');
            o.value = s.name;
            o.textContent = s.name;
            sel.appendChild(o);
        });
    }
    
    // Update escort select in booking form
    const escortSel = document.getElementById('bf-escort');
    if (escortSel) {
        escortSel.innerHTML = '<option value="">Any companion</option>';
        d.escorts.filter(e => e.available).forEach(e => {
            const o = document.createElement('option');
            o.value = e.id;
            o.textContent = e.name;
            escortSel.appendChild(o);
        });
    }
}

function renderReviews() {
    const d = getData();
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    d.reviews.forEach(r => {
        const el = document.createElement('div');
        el.className = 'review-card';
        el.innerHTML = `<p class="review-text">${r.text}</p><div class="review-author">${r.name}</div><div class="review-source">${r.source}</div>`;
        grid.appendChild(el);
    });
}

function renderBookingPage() {
    const d = getData();
    const ch = document.getElementById('contact-channels-list');
    if (ch) {
        ch.innerHTML = '';
        d.channels.forEach(c => {
            ch.innerHTML += `<div class="contact-channel">
                <div class="channel-icon">${c.icon}</div>
                <div>
                    <div class="channel-name">${c.name}</div>
                    <div class="channel-val">${c.value}</div>
                </div>
            </div>`;
        });
    }
    renderServices();
}

function renderCertPage() {
    const d = getData();
    const grid = document.getElementById('cert-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (!d.certs || d.certs.length === 0) {
        grid.innerHTML = `<div class="cert-empty" style="grid-column:1/-1;">
            <div>🎓</div>
            <p style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:300;color:var(--muted);">No certifications posted yet.</p>
            <p style="font-size:0.85rem;margin-top:0.5rem;">Check back soon — upload certificates from the admin panel.</p>
        </div>`;
        return;
    }
    
    d.certs.forEach((c) => {
        const card = document.createElement('div');
        card.className = 'cert-card';
        const imgHtml = c.image ? 
            `<img src="${c.image}" alt="${c.title}" style="width:100%;height:100%;object-fit:cover;" onclick="openLightbox('${c.image}')" onerror="if(!this.src.includes('placeholder')) this.src='https://via.placeholder.com/300x220?text=Certificate'">` :
            `<div class="cert-img-placeholder"><div>📜</div><p>${c.title}</p></div>`;
        
        card.innerHTML = `
            <div class="cert-img-wrap">${imgHtml}</div>
            <div class="cert-body">
                <div class="cert-title">${c.title}</div>
                <div class="cert-issuer">${c.issuer || ''}</div>
                <div class="cert-date">${c.date || ''}</div>
                ${c.desc ? `<p style="font-size:0.82rem;color:var(--muted);margin-top:0.5rem;line-height:1.6;">${c.desc}</p>` : ''}
            </div>`;
        grid.appendChild(card);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    
    // Handle hash links for scrolling
    if (window.location.hash) {
        const id = window.location.hash.substring(1);
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }
});