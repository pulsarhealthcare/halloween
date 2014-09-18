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

/* Pass the GET vars along to the leader board page */

var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

character = $_GET["char"];
userFirstName = $_GET["fname"];
userLastName = $_GET["lname"];
userEmail = $_GET["email"];
charName = "";

// end of GET vars declarations

// Use window.location to move to the scores page so we can use them in leader-board.html

window.location = 'leader-board.html?char='+character+'&fname='+userFirstName+'&lname='+userLastName+'&email='+userEmail+'&nick='+charName;
 
});



$('.restart').bind('click ontouchstart', function(e) {

//console.log(isGameOverScreen);
//console.log(game.data.steps);


  if(isGameOverScreen) {
          
                  isNewGame = true;
            isNewLevel = true;
        var oldTime = 0;
        var curTime = 0;
        game.data.steps = 0;


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

