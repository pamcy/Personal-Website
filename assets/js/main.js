// --------------------------------------
// Auto-hiding sticky navbar
// --------------------------------------
var navbar = $('.menu-isFixed'),
    currentTop = 0,
    lastTop = 0,
    scrollDelta = 10,
    scrollOffset = 150,
    isMobile = false;

function autoHideNav () {
    currentTop = $(this).scrollTop();

    if (lastTop - currentTop > scrollDelta) {
        navbar.removeClass('menu-isHidden');
    } else if (currentTop - lastTop > scrollDelta && currentTop > scrollOffset) {
        navbar.addClass('menu-isHidden');
    }

    lastTop = currentTop;
}

$(window).on('scroll', autoHideNav);


// --------------------------------------
// Smooth Scrolling
// --------------------------------------
function smoothScrolling(e) {
    e.preventDefault();

    var rootContainer;
    // 依據不同的裝置，指定不同的容器準備進行捲動
    if (isMobile) {
        rootContainer = $('html, body');
    } else {
        rootContainer = $('main');
    }

    var currentScrollTop = rootContainer.scrollTop(), // 取得目前容器的捲軸位置
        menuLink = $(this.hash),
        nextScrollTop = currentScrollTop + menuLink.offset().top, // 計算：欲移動距離
        scrollSpeed = 1000;

    // 如果目標與現在位置誤差小於絕對值 1 ，就不移動
    // Math.abs() 取絕對值, 正值表示畫面向下捲動，負值表示畫面向上捲動
    if (Math.abs(menuLink.offset().top) <= 1) {
        return false;
    }

    // 加入 stop() 連續點擊的時候才不會壞掉
    rootContainer.stop().animate(
            {'scrollTop': nextScrollTop},
            scrollSpeed
        );
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

// 判斷目前是否為 mobile
function isMobileDevice() {
    // 檢查 menu 的狀態判斷是否為 mobile 版
    isMobile = false;
    if ($('.menu').css('position') == 'fixed') {
        isMobile = true;
    }
}


$(document).ready(function() {

    isMobileDevice(); // 網站 onReady 馬上檢查使用者是否為 mobile (第一次，僅執行一次)

    // 每次當視窗大小變動，檢查使用者是否為 mobile
    $(window).resize(function() {
        isMobileDevice();
    });

    // Auto Typing Hello
    TitleRotateLaunch();

    // Smooth Scrolling
    $('a[href^="#"]').on('click', smoothScrolling);

    // Change form subject
    $('#form-subject').on('change', changeSubject);
});
