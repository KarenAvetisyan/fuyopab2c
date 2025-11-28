document.addEventListener('DOMContentLoaded', function(){
        /*Easy selector helper function */
        const select = (el, all = false) => {
                if (!el || typeof el !== 'string') return null;
                el = el.trim();
                if (all) {
                        return [...document.querySelectorAll(el)];
                } else {
                        return document.querySelector(el);
                }
        }
        /* Easy event listener function */
        const on = (type, el, listener, all = false) => {
                let selectEl = select(el, all)
                if (selectEl) {
                if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
                } else {
                selectEl.addEventListener(type, listener)
                }
                }
        }
        /* Easy on scroll event listener  */
        const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
        }

        // burger 
        const burger = select('.js-burger');
        const nav = select('.js-nav');

        document.addEventListener('click', (e) => {
            const isBurger = e.target.closest('.js-burger');
            const isNav = e.target.closest('.js-nav');

            if (isBurger) {
                burger.classList.toggle('clicked');
                nav.classList.toggle('show');
                return; 
            }
            if (e.target.matches('.js-nav .js-scrollTo')) {
                e.preventDefault();
                burger.classList.remove('clicked');
                nav.classList.remove('show');
                return;
            }
            if (!isNav) {
                burger.classList.remove('clicked');
                nav.classList.remove('show');
            }
        });

        
        // хедер при при скролле 
        let selectHeader = select('.header')
        if (selectHeader) {
        const headerScrolled = () => {
        if (window.scrollY > 50) {
                selectHeader.classList.add('scrolling')
        } else {
                selectHeader.classList.remove('scrolling')
        }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(window, headerScrolled)
        }

        // 1. Smooth scroll on click
        document.body.addEventListener('click', function(e) {
        if (!e.target.matches('.js-scrollTo')) return;
        let href = e.target.getAttribute('href');
        if (!href) return;
        if (href.startsWith('/')) href = href.slice(1);
        if (href.startsWith('#')) {
                const targetElement = document.querySelector(href);
                if (!targetElement) return;

                e.preventDefault();

                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const duration = 800; // Faster scroll (800ms)
                const start = window.scrollY;
                let startTime = null;

                function easeInOutQuad(t) {
                return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
                }

                function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeInOutQuad(progress);

                // Recalculate target position dynamically
                const targetY = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                const scrollTo = start + (targetY - start) * easedProgress;

                window.scrollTo(0, scrollTo);

                if (progress < 1) {
                        requestAnimationFrame(step);
                }
                }

                requestAnimationFrame(step);
        }
        }, true);

        
        // 2. Active Nav on Scroll
        let navs = select('.js-nav', true);

        const navbarlinksActive = () => {
        let scrollPosition = window.scrollY + 200;
        let pageBottom = document.documentElement.scrollHeight - window.innerHeight;
        let reachedBottom = window.scrollY >= pageBottom - 5;

        navs.forEach(nav => {
                let links = select('.js-scrollTo', true, nav); 

                links.forEach((link) => {
                const href = link.getAttribute('href');
                if (!href || !href.includes('#')) return;

                const hash = href.substring(href.indexOf('#'));
                const section = select(hash);
                if (!section) return;

                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;

                if (reachedBottom && hash === '#footer') {
                        select('.js-scrollTo[href="#footer"]', true).forEach(l => l.classList.add('_active'));
                        return;
                }
                if (!reachedBottom && scrollPosition >= top && scrollPosition < bottom) {
                        link.classList.add('_active');
                } else {
                        link.classList.remove('_active');
                }
                });
        });
        };

        window.addEventListener('load', navbarlinksActive);
        onscroll(document, navbarlinksActive);

        // dynamic swiper appear 
        function loadSwiperScript() {
                return new Promise((resolve) => {
                        const existingScript = document.querySelector(
                        'script[src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"]'
                        );

                        if (existingScript) {
                        resolve();
                        return;
                        }

                        const swiperScript = document.createElement('script');
                        swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
                        swiperScript.async = true;

                        swiperScript.onload = () => resolve();
                        document.body.appendChild(swiperScript);
                });
        }

        const swiperObserverCallback = (entries) => {
        entries.forEach(entry => {
                if (entry.isIntersecting) {

                loadSwiperScript().then(() => {
                        const swiperFeedback = document.querySelector('.swiperFeedback');
                        const swiperWay = document.querySelector('.swiperWay');
                        if (swiperFeedback) {
                                new Swiper(swiperFeedback, {
                                        loop: true,
                                        speed: 400,
                                        centeredSlides: false, 
                                        slidesPerView: 'auto',
                                        spaceBetween: 14,
                                        autoHeight: true,
                                        pagination: {
                                                el: swiperFeedback.querySelector('.swiper-pagination'),
                                                clickable: true,
                                        },
                                         breakpoints: {
                                                992: {
                                                centeredSlides: true, 
                                                spaceBetween: 26,
                                                }
                                        }
                                });
                        }
                        if (swiperWay) {
                                new Swiper(swiperWay, {
                                        loop: false,
                                        speed: 400,
                                        slidesPerView: 'auto',
                                        spaceBetween: 40,
                                        autoHeight: true,
                                        slidesPerGroup: 1,
                                        pagination: {
                                        el: swiperWay.querySelector('.swiper-pagination'),
                                        clickable: true,
                                        },
                                });
                        }
                        
                });

                swiperObserver.disconnect();
                }
        });
        };
        const swiperObserver = new IntersectionObserver(swiperObserverCallback, {
        rootMargin: '300px 0px', 
        });

        document.querySelectorAll('.swiper').forEach(el => {
        swiperObserver.observe(el);
        });


        // observer, анимация на скролле 
        const inViewport = (element, observer) => {
        element.forEach(entry => {
                entry.target.classList.toggle("is-inViewport", entry.isIntersecting);
                element.forEach(item => {
                if(item.target.classList.contains('is-inViewport') && !item.target.classList.contains('watched')){
                item.target.classList.add("watched");
                }
                })
        });
        };
        let ioConfiguration = {
        rootMargin: '0% 0% 0% 0%',
        threshold: 0.2
        };
        const Obs = new IntersectionObserver(inViewport, ioConfiguration);
        const obsOptions = {}; //See: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Intersection_observer_options
        const ELs_inViewport = document.querySelectorAll('[data-inviewport]');
        ELs_inViewport.forEach(EL => {
        Obs.observe(EL, obsOptions);
        });

})
