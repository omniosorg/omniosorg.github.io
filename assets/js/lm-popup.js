document.addEventListener('DOMContentLoaded', function () {
    const subscribe = document.getElementById('lm-subscribe');
    const optout = document.getElementById('lm-optout');
    const close = document.getElementById('lm-close');
    const popup = $('#lm-popup').modal();
    setTimeout(() => {
        const status = localStorage.getItem('lm-status');
        const last = localStorage.getItem('lm-last');
        switch (status) {
            case 'subscribed':
            case 'optout':
                return;
        }
        if (last && Date.now() - last < 4 * 7 * 24 * 60 * 60 * 1000) {
        return;
        }
        popup.modal('open');
    }, 5000);
    let done = () => {
        localStorage.setItem('lm-last', Date.now());
        if (optout.checked) {
            localStorage.setItem('lm-status', 'optout');
        }
    };
    close.addEventListener('pointerup', done);
    popup.on('pointerup', (e) => {
        if (e.target == popup) {
            done()
        }
    });
    subscribe.addEventListener('pointerup', () => {
        localStorage.setItem('lm-status', 'subscribed');
        window.open('https://list.omnios.org/subscription/form', '_blank');
        done();
    });
});