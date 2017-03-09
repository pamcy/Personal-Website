var navbar = $('.menu-isFixed'),
    windowCurrentTop = 0,
    windowLastTop = 0,
    scrollDelta = 10,
    scrollOffset = 150,
    isMobile = false,
    rootContainer,
    containerMobile = $('html, body'),
    containerDesk = $('main'),
    menuItem = $('.navMain-items a'),
    scrollSpeed = 1000;


// --------------------------------------
// Auto-hiding sticky navbar
// --------------------------------------
function autoHideNav () {
    windowCurrentTop = $(this).scrollTop();

    if (windowLastTop - windowCurrentTop > scrollDelta) {
        navbar.removeClass('menu-isHidden');
    } else if (windowCurrentTop - windowLastTop > scrollDelta && windowCurrentTop > scrollOffset) {
        navbar.addClass('menu-isHidden');
    }

    windowLastTop = windowCurrentTop;
}

$(window).on('scroll', autoHideNav);


// --------------------------------------
// Check Devices and choose its container
// --------------------------------------
function isMobileDevice() {
    var menuPosition = $('.menu').css('position');
    isMobile = false;

    if (menuPosition === 'fixed') {
        isMobile = true;
    }

    // Choose the container for scrolling according to the device
    rootContainer = (isMobile) ? containerMobile : containerDesk;
}


// --------------------------------------
// Smooth Scrolling
// --------------------------------------
function smoothScrolling(e) {

    e.preventDefault();

    var menuSection = $(this.hash),
        currentScrollTop = rootContainer.scrollTop(),
        nextScrollTop = currentScrollTop + menuSection.offset().top;

    // Scroll smoothly
    rootContainer.stop().animate(
            {'scrollTop': nextScrollTop},
            scrollSpeed
        );

    if (Math.abs(menuSection.offset().top) <= 1) {
        return false;
    }

    menuItem.removeClass('navMain-items-isActive'); // 先把所有 active 移掉

    // 目前點擊的對象，加上 active ，
    // 但是意義不大，因為只要 scroll 就會執行 menuScrolling()
    $(this).addClass('navMain-items-isActive');
}


// --------------------------------------
// Change menu color while scrolling
// --------------------------------------
function menuScrolling() {

    currentScrollTop = rootContainer.scrollTop(); // 取得目前捲動位置

    // each，檢查每個 menu 連結的位置
    $('.navMain-items a').each(function() {
        var linkMenu = $(this),
            linkSection = $(this.hash),

            // 取得這個 section 與可視畫面頂端的距離
            // 負數 : 表示在可視畫面上方
            // 正數 : 表示在可視畫下方或可視畫面內
            linkSectionTop = linkSection.offset().top,

            // 因為有 border 和 margin 寬度，所以使用 outerHeight()，才能拿到這個 section 真正佔用的畫面高度
            linkSectionHeight = linkSection.outerHeight();


        if (
               (linkSectionTop <= 1) // 目前 section 位置必須在可視畫面上方
            && (linkSectionHeight - Math.abs(linkSectionTop)) > 0 // section 高度減去 section 頂端位置大於 0 表示可視畫面在該 section 內
           ) {
            linkMenu.addClass('navMain-items-isActive');
        } else {
            linkMenu.removeClass('navMain-items-isActive');
        }
    });
}


// --------------------------------------
// Auto Typing Hello
// --------------------------------------
var TitleRotate = function(el, typing, period) {
    this.el = el;
    this.typing = typing;
    this.period = parseInt(period, 10) || 1500;
    this.loopNum = 0;
    this.text = '';
    this.tick();
    this.isDeleting = false;
}

TitleRotate.prototype.tick = function() {
    var i = this.loopNum % this.typing.length,
        fullText = this.typing[i],
        that = this,
        delta = 200 - Math.random() * 100;

    if (this.isDeleting) {
        this.text = fullText.substring(0, this.text.length - 1);
    } else {
        this.text = fullText.substring(0, this.text.length + 1);
    }

    this.el.innerHTML = `<span class="wrap">${this.text}</span>`;

    if (this.isDeleting) {
        delta /= 2;
    }

    if (!this.isDeleting && this.text === fullText) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.text === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

var TitleRotateLaunch = function() {
    var elements = document.getElementsByClassName('intro-title'),
        css = document.createElement('style');

    for(var i = 0; i < elements.length; i++) {
        var typingText = elements[i].getAttribute('data-text'),
            typingPeriod = elements[i].getAttribute('data-period');

        if (typingText) {
            new TitleRotate(elements[i], JSON.parse(typingText), typingPeriod);
        }
    }

    // Inject CSS
    css.type = 'text/css';
    css.innerHTML = '.intro-title > .wrap { border-right: .5rem solid #4ECDC4}';
    document.body.appendChild(css);
}


// --------------------------------------
// Change form subject
// --------------------------------------
function changeSubject() {
    var option = $('#form-subject option:selected').val(),
        formBodyHi = $('.contact-form').find('.form-body-hi'),
        formBodyWork = $('.contact-form').find('.form-body-work');

    if (option === '1') {
        formBodyHi.css('display', 'block').siblings('.form-body').css('display', 'none');
    } else if (option === '2') {
        formBodyWork.css('display', 'block').siblings('.form-body').css('display', 'none');
    }
}


// --------------------------------------
// Document Ready
// --------------------------------------
$(document).ready(function() {
    // Check if user on mobile device
    isMobileDevice();

    // 下面這行一定要在 isMobileDevice() 之後.
    // 在 $(document).ready() 裡就綁定/註冊下面的動作.
    // rootContainer 在 捲動時，就執行 menuScrolling().
    rootContainer.on('scroll', menuScrolling);

    // Resize Window and mobile detect
    $(window).on('resize', isMobileDevice);

    // Auto Typing Hello
    TitleRotateLaunch();

    // Smooth Scrolling
    $('a[href^="#"]').on('click', smoothScrolling);

    // Change form subject
    $('#form-subject').on('change', changeSubject);
});
