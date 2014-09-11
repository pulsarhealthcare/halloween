//Globals

var game = {};

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
    teamName: 'Unknown',
    oponentTeamKey: 'Unknown',
    selectedTeamKey: 'Unknown',
    user: 'Unknown',
    ignoreLoadingScreen: false,
    prevX: 0,
    isDown: false
};

game.onload = function(user, teamName, oponentTeamKey, selectedTeamKey) {
    me.sys.pauseOnBlur = false;
    this.data.teamName = teamName;
    this.data.oponentTeamKey = oponentTeamKey;
    this.data.selectedTeamKey = selectedTeamKey;
    this.data.user = user;
    /*      console.log(this.data.user + 'sdf'); */
    var width = 1024;
    var height = window.innerHeight;
    var scale = 1;
    if (isRetina() && window.ontouchstart !== 'undefined') {
        if (!me.video.init("screen", 1024, window.innerHeight, false, 'auto')) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
    } else {
        if (!me.video.init("screen", 1024, window.innerHeight, false)) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
    }
    me.sys.fps = 30;
    me.audio.init("mp3");
    me.loader.onload = this.loaded.bind(this);
    me.loader.preload(game.resources);
    me.state.change(me.state.LOADING);
}

game.loaded = function() {
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAME_OVER, new game.GameOverScreen());

        me.input.bindKey(me.input.KEY.LEFT, "moveLeft", false);
        me.input.bindKey(me.input.KEY.RIGHT, "moveRight", false);
        /*     me.input.bindTouch(me.input.KEY.SPACE); */

        me.pool.register("footballer", FootballerEntity);
        me.pool.register("pipe", PipeEntity, true);
        me.pool.register("reward", RewardEntity, true);
        me.pool.register("hit", HitEntity, true);
        me.pool.register("life", LifeLayer, false);
        me.pool.register("death", LifeLayer, false);


        me.input.registerPointerEvent("pointerup", me.game.viewport, function(e) {
            game.data.isDown = false;
        });

        me.input.registerPointerEvent("pointerdown", me.game.viewport, function(e) {

            game.data.isDown = true;
            game.data.prevX = e.gameX;

            if (me.state.isCurrent(me.state.GAME_OVER)) {
                if (me.input.mouse.pos.x < (me.video.getWidth() / 2)) {

                    var win = window.open('./leader-board.html?teamName=' + encodeURIComponent(game.data.teamName) + '&oponentTeamKey=' + game.data.oponentTeamKey + '&selectedTeamKey=' + game.data.selectedTeamKey, '_self');
                } else {

                    me.state.change(me.state.PLAY);

                }
            }

        });
};

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
        if (game.data.start && this.scroll && this.pos.y < 0) {
            // mechanics
            this.pos.add(this.accel);
        } else if (this.pos.y >= 0) {
            me.audio.play('hit-' + 3);
            me.device.vibrate(500);
            if (game.data.level < 3) {
                game.data.level++;
                game.data.originalSpeedModifier += 1;
                game.data.speedModifier = game.data.originalSpeedModifier;
                me.state.change(me.state.PLAY);
            } else {
                game.data.completedGame = true;
                me.state.change(me.state.GAME_OVER);
            }
        }

        return true;
    },

});

var TheGround = Object.extend({
    init: function(scroll) {
        this.ground1 = new Ground(0, -2729 + me.video.getHeight(), scroll);
        me.game.world.addChild(this.ground1, 1);
        this.collidable = false;
    },

    update: function() {
        return true;
    }
})

var BackgroundLayer = me.ImageLayer.extend({
    init: function(image, z, speed) {
        name = image;
        width = 1024;
        height = window.innerHeight;
        ratio = 1;
        // call parent constructor
        this.parent(name, width, height, image, z, ratio);
        this.isClickable = true;
    },
    update: function() {
        return true;
    }
});