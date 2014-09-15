var game = {};
var isPointerDown,hasMoved,moveDirection;
game.data = {
    score: 0,
    steps: 0,
    finalSteps: 0,
    start: false,
    lives: 3,
    level: 1,
    originalSpeedModifier: 3,
    speedModifier: 3,
    speedCounter: 0,

    ignoreHitsCounter: 0,
    ignoreLoadingScreen: false
}

game.onload = function(user, teamName) {
    me.sys.pauseOnBlur = false;
    this.data.teamName = teamName;
    this.data.user = user;


    var width = 1024;
    var height = ($(window).height() < 768) ? $(window).height() : 768;
    var scale = 1;


    if (isRetina() && window.ontouchstart !== 'undefined') {

        if (!me.video.init("screen", 1024, height, false, 'auto')) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
    } else {

        if (!me.video.init("screen", 1024, height, false)) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
    }


    me.sys.fps = 30;


    me.loader.onload = this.loaded.bind(this);
    me.loader.preload(game.resources);

    me.state.change(me.state.LOADING);
}

game.loaded = function() {
    me.state.set(me.state.PLAY, new game.PlayScreen());
    me.state.set(me.state.GAME_OVER, new game.GameOverScreen());

    me.input.bindKey(me.input.KEY.LEFT, "moveLeft", false);
    me.input.bindKey(me.input.KEY.RIGHT, "moveRight", false);

    me.pool.register("footballer", Character);
    me.pool.register("pipe", PipeEntity, true);
    me.pool.register("reward", RewardEntity, true);
    me.pool.register("life", LifeLayer, false);
    me.pool.register("death", LifeLayer, false);

    var lastX = 0;

    me.input.registerPointerEvent("pointerdown", me.game.viewport, function(e) {
        isPointerDown = true;console.log('test ')
        lastX = e.x;
    });
    me.input.registerPointerEvent("pointerup", me.game.viewport, function(e) {
        isPointerDown = false;
    });

    me.input.registerPointerEvent("pointermove", me.game.viewport, function(e) {
        hasMoved = false;
        
        if (isPointerDown) {

            if (e.x > lastX) {
                hasMoved = true;
                moveDirection = 1;

            } else if (e.x < lastX) {
                hasMoved = true;
                moveDirection = 0;
            }
        }

    });


    console.log('State to play');

    me.state.change(me.state.PLAY);

}

var Ground = me.ObjectEntity.extend({
    init: function(x, y, scroll) {
        var settings = {};
        settings.image = me.loader.getImage('ground-' + game.data.level);
        settings.width = 1024;
        settings.height = 2729;
        this.settings = settings;

        this.scroll = scroll;

        this.parent(x, y, settings);
        this.alwaysUpdate = true;
        this.gravity = 0;
        this.updateTime = false;
        this.accel = new me.Vector2d(0, 0.5);
        this.collidable = false;
    },

    update: function() {



        return true;
    },

});

var TheGround = Object.extend({
    init: function(scroll) {
        this.ground1 = new Ground(0, -2729 + me.video.getHeight(), scroll);
        me.game.world.addChild(this.ground1, 1);

        refPool.push(this.ground1);
        this.collidable = false;
    },

    update: function() {
        return true;
    }
})