var LeaderButton = me.GUI_Object.extend({
    init: function(x, y) {
        settings = {}
        settings.spritewidth = 100;
        settings.spriteheight = 100;
        settings.x = x;
        settings.y = y;
        settings.width = settings.spritewidth;
        settings.height = settings.spriteheight;
        settings.image = me.loader.getImage('transparent');

        // parent constructor
        this.parent(x, y, settings);
    },
    onClick: function(event) {
        var win = window.open('./leader-board.html', '_blank');
        win.focus();
        // don't propagate the event
        return false;
    }
});

var PlayButton = me.GUI_Object.extend({
    init: function(x, y) {
        settings = {}
        settings.spritewidth = 100;
        settings.spriteheight = 100;
        settings.x = x;
        settings.y = y;
        settings.width = settings.spritewidth;
        settings.height = settings.spriteheight;
        settings.image = me.loader.getImage('transparent');

        // parent constructor
        this.parent(x, y, settings);
    },
    onClick: function(event) {
        // don't propagate the event
        return false;
    }
});

function pad(number) {
    return Array(Math.max(4 - String(number).length + 1, 0)).join(0) + number;
}


function is_touch_device() {
    return !!('ontouchstart' in window);
}