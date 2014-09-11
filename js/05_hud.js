/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.ObjectContainer.extend({

    init: function() {
        // call the constructor
        this.parent();

        // persistent across level change
        this.isPersistent = true;

        // non collidable
        this.collidable = false;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.ScoreItem(5, 5));
        // add our child score object at the top left corner
        this.addChild(new game.HUD.LevelItem(5, 5));
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this.parent(new me.Vector2d(x, y), 10, 10);

        // local copy of the global score
        this.stepsFont = new me.Font('Oswald', 40, '#00259a', 'right');

        // make sure we use screen coordinates
        this.floating = true;
    },

    update: function() {
        return true;
    },

    draw: function(context) {
        if (game.data.start && me.state.isCurrent(me.state.PLAY))
            this.stepsFont.draw(context, 'SCORE ' + pad(game.data.steps), me.video.getWidth() - 20, 5);
    }

});

/**
 * a basic HUD item to display score
 */
game.HUD.LevelItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this.parent(new me.Vector2d(x, y), me.video.getWidth(), 10);

        // local copy of the global score
        this.stepsFont = new me.Font('Oswald', 72, '#00259a', 'center');

        // make sure we use screen coordinates
        this.floating = true;


    },

    update: function() {
        return true;
    },

    draw: function(context) {
        if (me.state.isCurrent(me.state.MENU) || (game.data.start && me.state.isCurrent(me.state.PLAY) && this.alpha == 1)) {
            this.stepsFont.draw(context, 'LEVEL ' + game.data.level, me.video.getWidth() / 2, (me.video.getHeight() / 2) - 36);
            var tween = new me.Tween(this).to({
                alpha: 0
            }, 1000);
            tween.delay(1500);
            tween.start();
        }
    }

});


var BackgroundLayer = me.ImageLayer.extend({
    init: function(image, z, speed) {
        name = image;
        width = 1024;
        height = 768;
        ratio = 1;
        // call parent constructor
        this.parent(name, width, height, image, z, ratio);
        this.isClickable = true;
    },
    update: function() {
        return true;
    }
});


var LifeLayer = me.ObjectEntity.extend({
    init: function(x, y, lifeIndex) {
        var settings = {};
        settings.image = me.loader.getImage('life');
        settings.width = 56;
        settings.height = 59;
        settings.spritewidth = 56;
        settings.spriteheight = 59;

        this.alive = true;
        this.lifeIndex = lifeIndex;
        this.parent(x, y, settings);


        this.renderable.addAnimation("life", [0]);
        this.renderable.addAnimation("death", [1]);
        this.renderable.setCurrentAnimation("life");

        this.alwaysUpdate = true;
    },

    update: function() {
        if ((3 - game.data.lives) > this.lifeIndex && this.alive) {
            this.renderable.setCurrentAnimation("death");
            this.alive = false;

        }

        return true;
    }
});