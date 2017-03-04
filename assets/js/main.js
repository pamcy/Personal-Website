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

    // 網路上找的：判斷使用者瀏覽器是不是 mobile 版

    // if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    // || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))  {
    //     isMobile = true;
    // }
    //^

    // 因為有可能將畫面拉大拉小，所以使用上的程式並不完全適用
    // 下面：檢查 menu 的狀態判斷是否為 mobile 版

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
