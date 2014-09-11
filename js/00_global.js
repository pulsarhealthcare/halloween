$(document).ready(function() {
    if (me.device.isMobile && !navigator.isCocoonJS) {
        // Prevent the webview from moving on a swipe
        window.document.addEventListener("touchmove", function(e) {
            e.preventDefault();
            window.scroll(0, 0);
            return false;
        }, false);
        // Scroll away mobile GUI
        (function() {
            window.scrollTo(0, 1);
            me.video.onresize(null);
        }).defer();
        me.event.subscribe(me.event.WINDOW_ONRESIZE, function(e) {
            window.scrollTo(0, 1);
        });
    }
    
})

function isRetina() {
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
            (min--moz-device-pixel-ratio: 1.5),\
            (-o-min-device-pixel-ratio: 3/2),\
            (min-resolution: 1.5dppx)";
    if (window.devicePixelRatio > 1)
        return true;
    if (window.matchMedia && window.matchMedia(mediaQuery).matches)
        return true;
    return false;
}

function pad(number) {
    return Array(Math.max(4 - String(number).length + 1, 0)).join(0) + number;
}


function is_touch_device() {
    return !!('ontouchstart' in window);
}