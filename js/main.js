// Auto Typing Hello
var TitleRotate = function(el, typing, period) {
    this.el = el;
    this.typing = typing;
    this.period = parseInt(period, 10) || 1500;
    this.loopNum = 0;
    this.text = '';
    this.tick();
    this.isDeleting = false;
    console.log(this);
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

window.onload = function() {
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
