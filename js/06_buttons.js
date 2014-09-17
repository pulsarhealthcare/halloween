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



$('.score').bind('click ontouchstart', function(e) {

      window.location = 'leader-board.html';
 
});



$('.restart').bind('click ontouchstart', function(e) {

console.log(isGameOverScreen);


  if(isGameOverScreen) {
          
                  isNewGame = true;
            isNewLevel = true;
            for (var x = 0; x < refPool.length; x++) {
                me.game.world.removeChild(refPool[x]);
            }
           $('.score').css({"z-index": "-1"});
           $('.restart').css({"z-index": "-1"}); 
           me.state.resume();
         }

});




function hitTest(x,y,w,h,t,l) {
    if(x > l && x < (l + w) && y > t && y < t + h) {
        return true;
    } else {
        return false;
    }
}

function pad(number) {
    return Array(Math.max(4 - String(number).length + 1, 0)).join(0) + number;
}


function is_touch_device() {
    return !!('ontouchstart' in window);
}

