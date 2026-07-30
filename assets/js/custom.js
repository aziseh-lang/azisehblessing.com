jQuery(document).ready(function ($) {
    "use strict";
    fc_StickyHeader();
    fc_Typed();
    function fc_Typed (){
        var typed = new Typed('#typed', {
            stringsElement: '#typed-strings',
            typeSpeed : 40,
            delaySpeed : 90,
            loop: true
        });
    }

    $('body').imagesLoaded(function() {
        fc_Aos();
    });
    function fc_Aos() {
        AOS.init({
            easing: 'ease',
            duration: 1000,
            once: true
        });
    }

    function fc_StickyHeader() {
        const body = $('body');
        const scrollUp = 'scroll-up';
        const scrollDown = 'scroll-down';
        let lastScroll = 0;

        var navbar = $('header');
        const scroll = $(window).scrollTop();
        if (scroll > navbar.outerHeight()) {
            body.addClass(scrollDown).removeClass(scrollUp);
        }

        $(window).on('scroll', () => {
            const currentScroll = $(window).scrollTop();
            if (currentScroll <= 0) {
                body.removeClass(scrollUp);
                return;
            }
            if (currentScroll > lastScroll && !body.hasClass(scrollDown)) {
                body.removeClass(scrollUp).addClass(scrollDown);
            } else if (currentScroll < lastScroll && body.hasClass(scrollDown)) {
                body.removeClass(scrollDown).addClass(scrollUp);
            }
            lastScroll = currentScroll;
        });
    }
});
