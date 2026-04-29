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

    // ─── 16. INFRASTRUCTURE SCROLL ANIMATION ───────────────
    const infraContainer = $('#infraScrollContainer');
    const infraTrack = $('#infraScrollTrack');
    const infraCards = $$('.infra-card.scroll-anim');
    
    if (infraContainer && infraTrack) {
        const updateInfra = () => {
            const rect = infraContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Total overscroll = how far track extends beyond container
            const overscroll = infraTrack.scrollWidth - infraContainer.clientWidth;

            // Start offset: center Machine 1 in the viewport
            // Machine 1 (first card) should be centered at progress=0
            const firstCard = infraTrack.firstElementChild;
            const cardWidth = firstCard ? firstCard.offsetWidth : 650;
            const startOffset = (infraContainer.clientWidth / 2) - (cardWidth / 2);

            if (rect.top < windowHeight && rect.bottom > 0) {
                const totalScroll = windowHeight + rect.height;
                const currentScroll = windowHeight - rect.top;
                let progress = currentScroll / totalScroll;
                progress = Math.max(0, Math.min(1, progress));

                // At progress=0: show Machine 1 centered → positive offset
                // At progress=1: fully scrolled to the right end → negative max
                const translateX = startOffset - (progress * (overscroll + startOffset));
                infraTrack.style.transform = `translate3d(${translateX}px, 0, 0)`;
            }
        };

        window.addEventListener('scroll', updateInfra, { passive: true });
        updateInfra(); // Run once on load to set initial center position
        
        // Progressive scale and fade via IntersectionObserver
        const infraObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px -5% 0px -5%' });
        
        infraCards.forEach(card => infraObserver.observe(card));
    }

})();

