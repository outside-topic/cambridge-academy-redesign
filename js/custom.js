/*=====================================
NAVBAR — Sticky, Glass, Menu-Open State
=====================================*/
(function () {
    const wrapper = document.getElementById('navbarWrapper');
    const hero = document.getElementById('navbarWrapper');
    const collapse = document.getElementById('navbarContent');
    if (!wrapper || !hero || !collapse) return;

    /* Sticky scroll handler */
    const handleScroll = function () {
        var heroBottom = hero.offsetTop + hero.offsetHeight;
        if (window.scrollY > heroBottom - 80) {
            wrapper.classList.add('scrolled');
        } else {
            wrapper.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* Menu-open class for mobile solid bg */
    collapse.addEventListener('show.bs.collapse', function () {
        wrapper.classList.add('menu-open');
    });
    collapse.addEventListener('hide.bs.collapse', function () {
        wrapper.classList.remove('menu-open');
    });
})();

/*=====================================
DESKTOP DROPDOWN — Hover-to-Show
=====================================*/
(function () {
    var desktopBreakpoint = 1200;

    function setupHoverDropdowns() {
        if (window.innerWidth < desktopBreakpoint) return;

        var dropdowns = document.querySelectorAll('.navbar-nav > .dropdown');
        dropdowns.forEach(function (dropdown) {
            var timeout;

            dropdown.addEventListener('mouseenter', function () {
                clearTimeout(timeout);
                var toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    var instance = bootstrap.Dropdown.getOrCreateInstance(toggle);
                    instance.show();
                }
            });

            dropdown.addEventListener('mouseleave', function () {
                timeout = setTimeout(function () {
                    var toggle = dropdown.querySelector('.dropdown-toggle');
                    if (toggle) {
                        var instance = bootstrap.Dropdown.getInstance(toggle);
                        if (instance) instance.hide();
                    }
                }, 160);
            });
        });
    }

    setupHoverDropdowns();

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setupHoverDropdowns, 300);
    });
})();

/*=====================================
HERO SLIDER
=====================================*/
(function () {
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.hdot');
    var prevBtn = document.getElementById('heroPrev');
    var nextBtn = document.getElementById('heroNext');
    var content = document.getElementById('heroContent');
    if (!slides.length) return;

    var current = 0;
    var total = slides.length;
    var interval;

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + total) % total;
        slides[current].classList.add('active');
        dots[current].classList.add('active');

        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(18px)';
            setTimeout(function () {
                content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 80);
        }
    }

    function startAuto() {
        interval = setInterval(function () { goTo(current + 1); }, 5500);
    }
    function stopAuto() { clearInterval(interval); }

    if (prevBtn) prevBtn.addEventListener('click', function () { stopAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stopAuto(); goTo(current + 1); startAuto(); });
    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { stopAuto(); goTo(i); startAuto(); });
    });

    startAuto();
})();

/*=====================================
TESTIMONIALS SLIDER
=====================================*/
(function () {
    var track = document.getElementById('testimonialsTrack');
    var viewport = document.getElementById('testimonialsViewport');
    var prevBtn = document.getElementById('testPrev');
    var nextBtn = document.getElementById('testNext');
    if (!track || !prevBtn || !nextBtn) return;

    var cards = track.querySelectorAll('.testimonial-card');
    var current = 0;

    function getVisible() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1200) return 2;
        return 3;
    }

    function getMax() {
        return Math.max(0, cards.length - getVisible());
    }

    function update() {
        var card = cards[0];
        if (!card) return;
        var gap = 28;
        var w = card.offsetWidth + gap;
        track.style.transform = 'translateX(-' + (current * w) + 'px)';
    }

    prevBtn.addEventListener('click', function () {
        current = Math.max(0, current - 1);
        update();
    });

    nextBtn.addEventListener('click', function () {
        current = Math.min(getMax(), current + 1);
        update();
    });

    /* Touch swipe support */
    var startX = 0;
    var isDragging = false;
    if (viewport) {
        viewport.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        viewport.addEventListener('touchend', function (e) {
            if (!isDragging) return;
            isDragging = false;
            var diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) { current = Math.min(getMax(), current + 1); }
                else { current = Math.max(0, current - 1); }
                update();
            }
        }, { passive: true });
    }

    var rt;
    window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () { current = Math.min(current, getMax()); update(); }, 200);
    });
})();

/*=====================================
COUNTER ANIMATION
=====================================*/
(function () {
    var counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    function animateCounter(el) {
        var target = parseInt(el.dataset.count, 10);
        var duration = 2200;
        var start = performance.now();

        function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

        function step(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var value = Math.floor(easeOutQuart(progress) * target);
            el.textContent = value.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString();
            }
        }
        requestAnimationFrame(step);
    }

    var started = false;
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !started) {
                started = true;
                counters.forEach(animateCounter);
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    var section = document.getElementById('statsSection');
    if (section) observer.observe(section);
})();

/*=====================================
SCROLL REVEAL
=====================================*/
(function () {
    var elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var delay = parseInt(entry.target.dataset.delay || 0, 10);
                setTimeout(function () {
                    entry.target.classList.add('revealed');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
})();

/*=====================================
BACK TO TOP
=====================================*/
(function () {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/*=====================================
SMOOTH ANCHOR SCROLL
=====================================*/
(function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var top = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });
})();

/*=====================================
KEYBOARD ACCESSIBILITY
=====================================*/
(function () {
    document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
        toggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    });
    document.querySelectorAll('.dropdown-item').forEach(function (item) {
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                var dropdown = item.closest('.dropdown');
                if (dropdown) {
                    var bsDropdown = bootstrap.Dropdown.getInstance(dropdown.querySelector('.dropdown-toggle'));
                    if (bsDropdown) bsDropdown.hide();
                }
            }
        });
    });
})();

/*=====================================
UTILITY FUNCTIONS
=====================================*/
(function () {
    window.debounce = function (fn, delay) {
        var t;
        return function () {
            var args = arguments;
            var ctx = this;
            clearTimeout(t);
            t = setTimeout(function () { fn.apply(ctx, args); }, delay);
        };
    };
    window.throttle = function (fn, limit) {
        var inThrottle;
        return function () {
            var args = arguments;
            var ctx = this;
            if (!inThrottle) {
                fn.apply(ctx, args);
                inThrottle = true;
                setTimeout(function () { inThrottle = false; }, limit);
            }
        };
    };
})();


// Certified Proofessionals start 
/*=====================================
NAVBAR — Force Scrolled on Inner Page
=====================================*/
(function () {
    var wrapper = document.getElementById('navbarWrapper');
    if (!wrapper) return;

    wrapper.classList.add('scrolled');

    var collapse = document.getElementById('navbarContent');
    if (!collapse) return;

    collapse.addEventListener('show.bs.collapse', function () {
        wrapper.classList.add('menu-open');
    });

    collapse.addEventListener('hide.bs.collapse', function () {
        wrapper.classList.remove('menu-open');
    });
})();

/*=====================================
DESKTOP DROPDOWN — Hover-to-Show
=====================================*/
(function () {
    var desktopBreakpoint = 1200;

    function setupHoverDropdowns() {
        if (window.innerWidth < desktopBreakpoint) return;

        var dropdowns = document.querySelectorAll('.navbar-nav > .dropdown');
        dropdowns.forEach(function (dropdown) {
            var timeout;

            dropdown.addEventListener('mouseenter', function () {
                clearTimeout(timeout);
                var toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    var instance = bootstrap.Dropdown.getOrCreateInstance(toggle);
                    instance.show();
                }
            });

            dropdown.addEventListener('mouseleave', function () {
                timeout = setTimeout(function () {
                    var toggle = dropdown.querySelector('.dropdown-toggle');
                    if (toggle) {
                        var instance = bootstrap.Dropdown.getInstance(toggle);
                        if (instance) instance.hide();
                    }
                }, 160);
            });
        });
    }

    setupHoverDropdowns();

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setupHoverDropdowns, 300);
    });
})();

/*=====================================
SCROLL REVEAL
=====================================*/
(function () {
    var elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var delay = parseInt(entry.target.dataset.delay || 0, 10);
                setTimeout(function () {
                    entry.target.classList.add('revealed');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
})();

/*=====================================
BACK TO TOP
=====================================*/
(function () {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/*=====================================
SMOOTH ANCHOR SCROLL
=====================================*/
(function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var top = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });
})();

/*=====================================
KEYBOARD ACCESSIBILITY
=====================================*/
(function () {
    document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
        toggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    });
})();
// Certified Proofessionals end 



// Cap Professional sCredentioals start
/*=====================================
NAVBAR — Force Scrolled on Inner Page
=====================================*/
        (function () {
            var wrapper = document.getElementById('navbarWrapper');
            if (!wrapper) return;

            wrapper.classList.add('scrolled');

            var collapse = document.getElementById('navbarContent');
            if (!collapse) return;

            collapse.addEventListener('show.bs.collapse', function () {
                wrapper.classList.add('menu-open');
            });

            collapse.addEventListener('hide.bs.collapse', function () {
                wrapper.classList.remove('menu-open');
            });
        })();

        /*=====================================
        DESKTOP DROPDOWN — Hover-to-Show
        =====================================*/
        (function () {
            var desktopBreakpoint = 1200;

            function setupHoverDropdowns() {
                if (window.innerWidth < desktopBreakpoint) return;

                var dropdowns = document.querySelectorAll('.navbar-nav > .dropdown');
                dropdowns.forEach(function (dropdown) {
                    var timeout;

                    dropdown.addEventListener('mouseenter', function () {
                        clearTimeout(timeout);
                        var toggle = dropdown.querySelector('.dropdown-toggle');
                        if (toggle) {
                            var instance = bootstrap.Dropdown.getOrCreateInstance(toggle);
                            instance.show();
                        }
                    });

                    dropdown.addEventListener('mouseleave', function () {
                        timeout = setTimeout(function () {
                            var toggle = dropdown.querySelector('.dropdown-toggle');
                            if (toggle) {
                                var instance = bootstrap.Dropdown.getInstance(toggle);
                                if (instance) instance.hide();
                            }
                        }, 160);
                    });
                });
            }

            setupHoverDropdowns();

            var resizeTimer;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(setupHoverDropdowns, 300);
            });
        })();

        /*=====================================
        LEVEL PROGRESS BARS — Animate on Scroll
        =====================================*/
        (function () {
            var levelCards = document.querySelectorAll('.level-card');
            if (!levelCards.length) return;

            levelCards.forEach(function (card) {
                var fill = card.querySelector('.level-bar-fill');
                if (!fill) return;

                var targetWidth = fill.style.width;
                fill.style.width = '0%';
                fill.style.setProperty('--bar-width', targetWidth);
            });

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var fill = entry.target.querySelector('.level-bar-fill');
                        if (fill) {
                            var target = fill.style.getPropertyValue('--bar-width');
                            /* Small delay for staggered effect */
                            var delay = parseInt(entry.target.closest('[data-delay]')?.dataset.delay || 0, 10);
                            setTimeout(function () {
                                fill.style.width = target;
                            }, delay + 400);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            levelCards.forEach(function (card) { observer.observe(card); });
        })();

        /*=====================================
        SCROLL REVEAL
        =====================================*/
        (function () {
            var elements = document.querySelectorAll('[data-reveal]');
            if (!elements.length) return;

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var delay = parseInt(entry.target.dataset.delay || 0, 10);
                        setTimeout(function () {
                            entry.target.classList.add('revealed');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

            elements.forEach(function (el) { observer.observe(el); });
        })();

        /*=====================================
        BACK TO TOP
        =====================================*/
        (function () {
            var btn = document.getElementById('backToTop');
            if (!btn) return;
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        })();

        /*=====================================
        SMOOTH ANCHOR SCROLL
        =====================================*/
        (function () {
            document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
                anchor.addEventListener('click', function (e) {
                    var href = this.getAttribute('href');
                    if (href === '#') return;
                    var target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        var top = target.getBoundingClientRect().top + window.scrollY - 80;
                        window.scrollTo({ top: top, behavior: 'smooth' });
                    }
                });
            });
        })();

        /*=====================================
        KEYBOARD ACCESSIBILITY
        =====================================*/
        (function () {
            document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
                toggle.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle.click();
                    }
                });
            });
        })();
// Cap Professional sCredentioals end

// CAP Function Specialist start
/*=====================================
NAVBAR — Force Scrolled on Inner Page
=====================================*/
        (function () {
            var wrapper = document.getElementById('navbarWrapper');
            if (!wrapper) return;

            wrapper.classList.add('scrolled');

            var collapse = document.getElementById('navbarContent');
            if (!collapse) return;

            collapse.addEventListener('show.bs.collapse', function () {
                wrapper.classList.add('menu-open');
            });

            collapse.addEventListener('hide.bs.collapse', function () {
                wrapper.classList.remove('menu-open');
            });
        })();

        /*=====================================
        DESKTOP DROPDOWN — Hover-to-Show
        =====================================*/
        (function () {
            var desktopBreakpoint = 1200;

            function setupHoverDropdowns() {
                if (window.innerWidth < desktopBreakpoint) return;

                var dropdowns = document.querySelectorAll('.navbar-nav > .dropdown');
                dropdowns.forEach(function (dropdown) {
                    var timeout;

                    dropdown.addEventListener('mouseenter', function () {
                        clearTimeout(timeout);
                        var toggle = dropdown.querySelector('.dropdown-toggle');
                        if (toggle) {
                            var instance = bootstrap.Dropdown.getOrCreateInstance(toggle);
                            instance.show();
                        }
                    });

                    dropdown.addEventListener('mouseleave', function () {
                        timeout = setTimeout(function () {
                            var toggle = dropdown.querySelector('.dropdown-toggle');
                            if (toggle) {
                                var instance = bootstrap.Dropdown.getInstance(toggle);
                                if (instance) instance.hide();
                            }
                        }, 160);
                    });
                });
            }

            setupHoverDropdowns();

            var resizeTimer;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(setupHoverDropdowns, 300);
            });
        })();

        /*=====================================
        SCROLL REVEAL
        =====================================*/
        (function () {
            var elements = document.querySelectorAll('[data-reveal]');
            if (!elements.length) return;

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var delay = parseInt(entry.target.dataset.delay || 0, 10);
                        setTimeout(function () {
                            entry.target.classList.add('revealed');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

            elements.forEach(function (el) { observer.observe(el); });
        })();

        /*=====================================
        COMPETENCY DOT PULSE — Subtle Animation
        =====================================*/
        (function () {
            var activeDot = document.querySelector('.competency-dot--active');
            if (!activeDot) return;

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        activeDot.style.animation = 'dotPulse 2.5s ease-in-out infinite';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            var section = document.getElementById('competencySection');
            if (section) observer.observe(section);

            /* Inject keyframes */
            var style = document.createElement('style');
            style.textContent = '@keyframes dotPulse{0%,100%{box-shadow:0 0 0 2px var(--accent),0 0 0 6px rgba(247,126,6,.15)}50%{box-shadow:0 0 0 2px var(--accent),0 0 0 12px rgba(247,126,6,0)}}';
            document.head.appendChild(style);
        })();

        /*=====================================
        ASSESSMENT FRAME — Shimmer Accent Bar
        =====================================*/
        (function () {
            /* Shimmer animation is CSS-driven — no JS needed */
            /* This block reserved for any future JS enhancements */
        })();

        /*=====================================
        BACK TO TOP
        =====================================*/
        (function () {
            var btn = document.getElementById('backToTop');
            if (!btn) return;
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        })();

        /*=====================================
        SMOOTH ANCHOR SCROLL
        =====================================*/
        (function () {
            document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
                anchor.addEventListener('click', function (e) {
                    var href = this.getAttribute('href');
                    if (href === '#') return;
                    var target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        var top = target.getBoundingClientRect().top + window.scrollY - 80;
                        window.scrollTo({ top: top, behavior: 'smooth' });
                    }
                });
            });
        })();

        /*=====================================
        KEYBOARD ACCESSIBILITY
        =====================================*/
        (function () {
            document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
                toggle.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle.click();
                    }
                });
            });
        })();
// CAP Function Specialist end