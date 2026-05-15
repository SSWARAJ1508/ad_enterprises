/**
 * AD Enterprises — Premium Agency Script
 */
(() => {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

    // ─── 1. LOADER & HERO ENTRANCE ───────────────────────────────
    const loader = $('#loader');

    // Stagger hero elements in after loader
    const animateHeroIn = () => {
        const heroEls = $$('.hero [data-reveal]');
        heroEls.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(36px)';
            el.style.transition = `opacity .9s ease ${200 + i * 120}ms, transform .9s ease ${200 + i * 120}ms`;
            requestAnimationFrame(() => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                }, 50);
            });
        });
    };

    const hideLoader = () => {
        if (!loader) return;
        if (loader.classList.contains('hidden')) return;
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        animateHeroIn();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('load', () => setTimeout(hideLoader, 1100));
    setTimeout(hideLoader, 3000);

    // ─── 2. CUSTOM CURSOR ────────────────────────────────────────
    const cursorDot  = $('#cursor-dot');
    const cursorRing = $('#cursor-ring');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    if (cursorDot && cursorRing && window.matchMedia('(pointer:fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top  = mouseY + 'px';
        });
        const animateCursor = () => {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
            requestAnimationFrame(animateCursor);
        };
        animateCursor();
        $$('a, button, [data-tilt]').forEach(el => {
            on(el, 'mouseenter', () => {
                cursorRing.style.width  = '54px';
                cursorRing.style.height = '54px';
                cursorRing.style.borderColor = 'var(--c-green)';
            });
            on(el, 'mouseleave', () => {
                cursorRing.style.width  = '';
                cursorRing.style.height = '';
                cursorRing.style.borderColor = '';
            });
        });
    } else {
        if (cursorDot)  cursorDot.style.display  = 'none';
        if (cursorRing) cursorRing.style.display = 'none';
    }

    // ─── 3. NAVBAR ───────────────────────────────────────────────
    const navbar  = $('#navbar');
    const fabTop  = $('#backTop');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', y > 60);
        if (fabTop) fabTop.classList.toggle('visible', y > 500);
        updateActiveNav(y);
    }, { passive: true });

    const sections  = $$('section[id]');
    const navItems  = $$('.nav-item');

    function updateActiveNav(scrollY) {
        const pos = scrollY + 160;
        sections.forEach(sec => {
            if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
                const id = sec.getAttribute('id');
                navItems.forEach(ni => ni.classList.toggle('active', ni.dataset.section === id));
            }
        });
    }

    // ─── 4. MOBILE DRAWER ────────────────────────────────────────
    const hamburger     = $('#hamburger');
    const mobileDrawer  = $('#mobileDrawer');
    const drawerClose   = $('#drawerClose');
    const drawerOverlay = $('#drawerOverlay');
    const drawerLinks   = $$('.drawer-link');

    const openDrawer  = () => { mobileDrawer?.classList.add('open'); drawerOverlay?.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const closeDrawer = () => { mobileDrawer?.classList.remove('open'); drawerOverlay?.classList.remove('open'); document.body.style.overflow = ''; };

    on(hamburger, 'click', openDrawer);
    on(drawerClose, 'click', closeDrawer);
    on(drawerOverlay, 'click', closeDrawer);
    drawerLinks.forEach(l => on(l, 'click', closeDrawer));

    // ─── 5. SMOOTH SCROLL ────────────────────────────────────────
    $$('a[href^="#"]').forEach(a => {
        on(a, 'click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    // ─── 6. HERO PARALLAX ────────────────────────────────────────
    const heroLayer1 = $('.hero-layer-1');
    window.addEventListener('scroll', () => {
        if (!heroLayer1) return;
        heroLayer1.style.transform = `scale(1.1) translateY(${window.scrollY * 0.2}px)`;
    }, { passive: true });

    // ─── 7. SCROLL REVEAL (non-hero elements) ────────────────────
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            const delay = parseInt(el.dataset.delay || 0);

            if (entry.isIntersecting) {
                // Animate in when entering viewport
                el.revealTimeout = setTimeout(() => el.classList.add('revealed'), delay);
            } else {
                // Reset and fade out when leaving viewport
                clearTimeout(el.revealTimeout);
                el.classList.remove('revealed');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    // Only observe non-hero reveal elements
    $$('[data-reveal]').forEach(el => {
        if (!el.closest('.hero')) revealObs.observe(el);
    });

    // ─── 8. ANIMATED COUNTERS ────────────────────────────────────
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            
            if (entry.isIntersecting) {
                if (el.dataset.animating === "true") return;
                el.dataset.animating = "true";
                
                const target = parseInt(el.dataset.target, 10);
                const step = target / (1800 / 16);
                let current = 0;
                
                clearInterval(el.counterTimer);
                el.counterTimer = setInterval(() => {
                    current += step;
                    if (current >= target) { 
                        current = target; 
                        clearInterval(el.counterTimer); 
                        delete el.dataset.animating;
                    }
                    el.textContent = Math.floor(current);
                }, 16);
            } else {
                // Reset counter when not visible so it plays again on reappear
                clearInterval(el.counterTimer);
                delete el.dataset.animating;
                el.textContent = "0";
            }
        });
    }, { threshold: 0.5 });
    $$('.counter').forEach(el => counterObs.observe(el));

    // ─── 9. CARD TILT ────────────────────────────────────────────
    if (window.matchMedia('(pointer:fine)').matches) {
        $$('[data-tilt]').forEach(card => {
            on(card, 'mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width  - 0.5;
                const y = (e.clientY - rect.top)  / rect.height - 0.5;
                card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
            });
            on(card, 'mouseleave', () => { card.style.transform = ''; });
        });
    }

    // ─── 10. PORTFOLIO FILTER ────────────────────────────────────
    const filterBtns = $$('.pf-btn');
    const pfItems    = $$('.pf-item');
    const pfSeeMoreWrap = $('#pfSeeMoreWrap');
    const pfSeeMoreBtn  = $('#pfSeeMoreBtn');
    
    let showingAllWork = true;
    let allWorkExpanded = false;
    const INITIAL_ALL_LIMIT = 9;

    const renderPortfolio = () => {
        pfItems.forEach((item, index) => {
            let show = false;
            if (showingAllWork) {
                show = allWorkExpanded ? true : index < INITIAL_ALL_LIMIT;
            } else {
                const activeBtn = $('.pf-btn.active');
                const filter = activeBtn ? activeBtn.dataset.filter : 'all';
                show = item.classList.contains(filter);
            }

            item.style.transition = 'opacity .35s ease, transform .35s ease';
            if (show) {
                if (item.classList.contains('hidden')) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.96)';
                    requestAnimationFrame(() => setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = '';
                    }, 30));
                }
            } else {
                item.classList.add('hidden');
                item.style.opacity = '0';
            }
        });
        
        if (pfSeeMoreWrap) {
            pfSeeMoreWrap.style.display = (showingAllWork && !allWorkExpanded && pfItems.length > INITIAL_ALL_LIMIT) ? 'block' : 'none';
        }
    };

    filterBtns.forEach(btn => {
        on(btn, 'click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            showingAllWork = (btn.dataset.filter === 'all');
            if (showingAllWork) allWorkExpanded = false;
            
            renderPortfolio();
        });
    });

    if (pfSeeMoreBtn) {
        on(pfSeeMoreBtn, 'click', () => {
            allWorkExpanded = true;
            renderPortfolio();
        });
    }

    renderPortfolio();

    // ─── 11. LIGHTBOX MODAL ──────────────────────────────────────
    const modal        = $('#imageModal');
    const modalImg     = $('#modalImg');
    const modalCaption = $('#modalCaption');
    const modalClose   = $('#modalClose');
    const modalPrev    = $('#modalPrev');
    const modalNext    = $('#modalNext');

    let images = [];
    let currentIdx = 0;

    $$('.pf-zoom').forEach((btn, i) => {
        images.push({ src: btn.dataset.src, title: btn.dataset.title });
        on(btn, 'click', (e) => { e.stopPropagation(); openModal(i); });
    });

    function openModal(idx) {
        if (!modal) return;
        currentIdx = idx;
        modalImg.src = images[idx].src;
        modalCaption.textContent = images[idx].title;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    const closeModal = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
    const showPrev = () => openModal((currentIdx - 1 + images.length) % images.length);
    const showNext = () => openModal((currentIdx + 1) % images.length);

    on(modalClose, 'click', closeModal);
    on(modalPrev, 'click', showPrev);
    on(modalNext, 'click', showNext);
    on(modal, 'click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (!modal?.classList.contains('open')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // ─── 12. BACK TO TOP ─────────────────────────────────────────
    on(fabTop, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ─── 13. CONTACT FORM ────────────────────────────────────────
    const contactForm = $('#contactForm');
    const submitBtn   = $('#submitBtn');

    on(contactForm, 'submit', (e) => {
        e.preventDefault();
        if (!submitBtn) return;
        const label = submitBtn.querySelector('.btn-label');
        const icon  = submitBtn.querySelector('i');
        const originalLabel = label ? label.textContent : 'Send Message';
        submitBtn.disabled = true;
        if (label) label.textContent = 'Sending…';
        if (icon)  icon.className = 'fas fa-spinner fa-spin';
        setTimeout(() => {
            if (label) label.textContent = 'Message Sent!';
            if (icon)  icon.className = 'fas fa-check';
            submitBtn.style.background = 'linear-gradient(135deg, #00f28a, #00b866)';
            contactForm.reset();
            setTimeout(() => {
                if (label) label.textContent = originalLabel;
                if (icon)  icon.className = 'fas fa-paper-plane';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1600);
    });

    // ─── 14. NEWSLETTER  ─────────────────────────────────────────
    const ftForm = $('.ft-subscribe');
    on(ftForm, 'submit', (e) => {
        e.preventDefault();
        const inp = ftForm.querySelector('input');
        const btn = ftForm.querySelector('button');
        if (inp?.value) {
            btn.innerHTML = '<i class="fas fa-check"></i>';
            inp.value = '';
            setTimeout(() => { btn.innerHTML = '<i class="fas fa-paper-plane"></i>'; }, 2500);
        }
    });

    // ─── 15. HERO SLIDER ─────────────────────────────────────────
    const initHeroSlider = () => {
        const sliderImgs = $$('.slider-img');
        if (!sliderImgs.length) return;
        let currentIdx = 0;
        setInterval(() => {
            sliderImgs[currentIdx].classList.remove('active');
            currentIdx = (currentIdx + 1) % sliderImgs.length;
            sliderImgs[currentIdx].classList.add('active');
        }, 2000);
    };
    initHeroSlider();

    // ─── 16. INFRASTRUCTURE CAROUSEL (manual) ──────────────
    const infraViewport = $('#infraViewport');
    const infraTrack    = $('#infraTrack');
    const infraPrev     = $('#infraPrev');
    const infraNext     = $('#infraNext');
    const infraDotEls   = $$('.infra-dot');

    if (infraTrack && infraViewport) {
        const cards     = $$('.infra-card', infraTrack);
        const total     = cards.length;
        let current     = 0;

        const getOffset = (index) => {
            const vpW    = infraViewport.clientWidth;
            const cardEl = cards[index];
            if (!cardEl) return 0;
            const cardW  = cardEl.offsetWidth;
            // Position the card so it is centred inside the viewport
            const cardLeft = cardEl.offsetLeft;
            return cardLeft - (vpW / 2) + (cardW / 2);
        };

        const goTo = (index) => {
            current = Math.max(0, Math.min(total - 1, index));
            infraTrack.style.transform = `translateX(-${getOffset(current)}px)`;

            // Update dots
            infraDotEls.forEach((d, i) => d.classList.toggle('active', i === current));

            // Update button states
            if (infraPrev) infraPrev.disabled = (current === 0);
            if (infraNext) infraNext.disabled = (current === total - 1);
        };

        // Prev / Next buttons
        on(infraPrev, 'click', () => goTo(current - 1));
        on(infraNext, 'click', () => goTo(current + 1));

        // Dot clicks
        infraDotEls.forEach(dot => {
            on(dot, 'click', () => goTo(parseInt(dot.dataset.index, 10)));
        });

        // Swipe / touch support
        let touchStartX = 0;
        infraViewport.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        infraViewport.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
        }, { passive: true });

        // Initialise: centre Card 1 after paint so offsetWidth is ready
        requestAnimationFrame(() => {
            infraTrack.style.transition = 'none'; // no flicker on first load
            goTo(0);
            requestAnimationFrame(() => {
                infraTrack.style.transition = ''; // restore transition
            });
        });
    }

})();

/* ══════════════════════════════════════════════════════════
   HELP BOT — FAQ CHATBOT MODULE (Overlay only, no side-effects)
══════════════════════════════════════════════════════════ */
(() => {
    'use strict';

    // ── FAQ Knowledge Base ─────────────────────────────────────────
    const FAQ = [
        // Company
        { keys: ['located', 'location', 'where', 'office', 'address', 'city', 'state'],
          ans: '📍 Head office in Patna, Bihar. Branch in Ranchi, Jharkhand. Serving both states.' },
        { keys: ['founded', 'started', 'established', 'when', 'year', 'since'],
          ans: '🗓️ Founded in 2014 by Abhineet Raj in Patna, Bihar.' },
        { keys: ['experience', 'years', 'old', 'how long', 'expertise'],
          ans: '🏆 10+ years of experience with 500+ completed projects across Bihar & Jharkhand.' },

        // Services
        { keys: ['services', 'offer', 'do you do', 'what do', 'provide', 'available'],
          ans: '🎨 We offer: Hoardings, Flex boards, Glow sign boards, ACP panels, In-shop branding, Wall painting & Installation.' },
        { keys: ['installation', 'install', 'setup', 'fitting', 'fix'],
          ans: '🔧 Yes! We handle full design, printing, and installation — end to end.' },

        // Hoardings
        { keys: ['hoarding', 'billboard', 'outdoor board', 'large board'],
          ans: '🪧 Large outdoor billboards for maximum visibility on roads and highways.' },
        { keys: ['durable', 'durability', 'long last', 'weather', 'waterproof', 'last'],
          ans: '✅ Our prints are weather-resistant and long-lasting — built for outdoor conditions.' },

        // Flex Printing
        { keys: ['flex', 'vinyl', 'banner', 'flex print', 'printing'],
          ans: '🖨️ Large-format vinyl printing for banners. Waterproof, durable, ideal for outdoors.' },

        // Glow Signs
        { keys: ['glow', 'glow sign', 'led', 'signboard', 'sign board', 'backlit', 'illuminate'],
          ans: '💡 LED-lit acrylic & ACP signboards for shops — clear visibility day and night.' },
        { keys: ['night', 'visibility', 'visible', 'bright'],
          ans: '🌙 Glow sign boards ensure clear brand visibility both day and night.' },

        // ACP
        { keys: ['acp', 'acp panel', 'panel', 'aluminium', 'aluminum'],
          ans: '🏗️ ACP (Aluminium Composite Panel) boards for premium, modern exterior signage.' },

        // In-shop Branding
        { keys: ['inshop', 'in-shop', 'shop', 'interior', 'retail', 'showroom', 'branding'],
          ans: '🏪 In-shop branding: vinyl pasting, product displays, POS & showroom interior setups.' },

        // Wall Painting
        { keys: ['wall', 'wall paint', 'wall branding', 'paint'],
          ans: '🎨 Durable wall painting & branding for rural, semi-urban and commercial zones.' },

        // Machines
        { keys: ['machine', 'machines', 'equipment', 'printer', 'technology'],
          ans: '🖨️ We use: Konica 512i Solvent Printer & Eco Solvent DX5 Head Printer.' },
        { keys: ['konica', 'konica 512', '512i', 'solvent printer'],
          ans: '⚡ Konica 512i: high-speed solvent printer for vivid, durable outdoor prints.' },
        { keys: ['eco solvent', 'dx5', 'eco', 'indoor printer'],
          ans: '🎯 Eco Solvent DX5: high-quality indoor printing with precise, lasting detail.' },

        // Pricing & Quote
        { keys: ['price', 'pricing', 'cost', 'rate', 'charge', 'fee', 'quote', 'quotation', 'estimate'],
          ans: '💰 Free quotations available! Contact us on WhatsApp or via the contact form for a custom quote.' },

        // Contact
        { keys: ['contact', 'reach', 'call', 'whatsapp', 'phone', 'number', 'email', 'get in touch'],
          ans: '📞 Contact us via WhatsApp: +91 73017 42314 or use the Contact section on our website.' },
        { keys: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste'],
          ans: '👋 Hello! Ask me about our services, hoardings, machines, or contact details.' },
        { keys: ['thank', 'thanks', 'great', 'awesome', 'perfect', 'wonderful'],
          ans: "😊 You're welcome! Let us know if you have more questions." },
    ];

    const FALLBACK = '🤝 Please contact us on WhatsApp (+91 73017 42314) for detailed help.';
    const WELCOME  = "Hi! I'm AD Enterprises Help Bot 👋\nAsk me about services, hoardings, machines, or contact details.";

    // ── DOM Refs ───────────────────────────────────────────────────
    const btn       = document.getElementById('helpBotBtn');
    const win       = document.getElementById('helpBotWindow');
    const closeBtn  = document.getElementById('helpBotClose');
    const messages  = document.getElementById('helpBotMessages');
    const input     = document.getElementById('helpBotInput');
    const sendBtn   = document.getElementById('helpBotSend');
    const quickBtns = document.querySelectorAll('.helpbot-quick');

    if (!btn || !win) return;   // guard: elements must exist

    // ── State ──────────────────────────────────────────────────────
    let isOpen = false;
    let welcomeShown = false;

    // ── Helpers ────────────────────────────────────────────────────
    const getTime = () => {
        const d = new Date();
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const scrollToBottom = () => {
        messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
    };

    const addMessage = (text, type) => {
        const wrap = document.createElement('div');
        wrap.className = 'helpbot-msg ' + type;

        const bubble = document.createElement('div');
        bubble.className = 'helpbot-bubble';
        bubble.innerHTML = text.replace(/\n/g, '<br>');

        const time = document.createElement('div');
        time.className = 'helpbot-msg-time';
        time.textContent = getTime();

        wrap.appendChild(bubble);
        wrap.appendChild(time);
        messages.appendChild(wrap);
        scrollToBottom();
    };

    const showTyping = () => {
        const wrap = document.createElement('div');
        wrap.className = 'helpbot-msg bot helpbot-typing';
        wrap.id = 'helpbotTypingIndicator';
        wrap.innerHTML = '<div class="helpbot-bubble"><span class="helpbot-dot"></span><span class="helpbot-dot"></span><span class="helpbot-dot"></span></div>';
        messages.appendChild(wrap);
        scrollToBottom();
    };

    const hideTyping = () => {
        const t = document.getElementById('helpbotTypingIndicator');
        if (t) t.remove();
    };

    // ── Keyword Matching ───────────────────────────────────────────
    const getAnswer = (query) => {
        const q = query.toLowerCase().trim();
        for (const entry of FAQ) {
            if (entry.keys.some(k => q.includes(k))) return entry.ans;
        }
        return FALLBACK;
    };

    // ── Bot Reply with typing indicator ────────────────────────────
    const botReply = (text) => {
        showTyping();
        const delay = 700 + Math.random() * 400;
        setTimeout(() => {
            hideTyping();
            addMessage(text, 'bot');
        }, delay);
    };

    // ── Open / Close ───────────────────────────────────────────────
    const openChat = () => {
        win.classList.add('helpbot-open');
        win.setAttribute('aria-hidden', 'false');
        btn.setAttribute('aria-label', 'Close Help Bot');
        isOpen = true;

        if (!welcomeShown) {
            welcomeShown = true;
            setTimeout(() => addMessage(WELCOME, 'bot'), 320);
        } else {
            scrollToBottom();
        }
        setTimeout(() => input.focus(), 380);
    };

    const closeChat = () => {
        win.classList.remove('helpbot-open');
        win.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-label', 'Open Help Bot');
        isOpen = false;
    };

    // ── Send ───────────────────────────────────────────────────────
    const handleSend = () => {
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        addMessage(text, 'user');
        botReply(getAnswer(text));
    };

    // ── Event Listeners ────────────────────────────────────────────
    btn.addEventListener('click', () => isOpen ? closeChat() : openChat());
    closeBtn.addEventListener('click', closeChat);
    sendBtn.addEventListener('click', handleSend);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });

    quickBtns.forEach(qb => {
        qb.addEventListener('click', () => {
            const label = qb.textContent.replace(/^\W+/, '').trim();
            addMessage(label, 'user');
            botReply(getAnswer(qb.dataset.query));
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) closeChat();
    });

})();