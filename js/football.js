var GameOverBackground = me.ObjectEntity.extend({
    init: function(x, y, image, z) {
        var settings = {};
        settings.image = me.loader.getImage(image);
        settings.width = 1024;
        settings.height = 672;
        settings.spritewidth = 1024;
        settings.spriteheight = 690;
        this.parent(x, y, settings);
    },


    update: function() {
        if (game.data.mDown) {

        }
        return true;
    },
});

$(window).on('keydown', function(e) {
    if(e.which === 80) {
        if(me.state.isPaused()){
             me.state.resume();
        } else {
             me.state.pause();
        }
       
    }
})

var refPool = [];

game.PlayScreen = me.ScreenObject.extend({
    init: function() {},

    onResetEvent: function(test) {
        game.data.speedModifier = game.data.originalSpeedModifier;
        game.data.speedCounter = 0;

        me.input.bindKey(me.input.KEY.LEFT, "moveLeft", false);
        me.input.bindKey(me.input.KEY.RIGHT, "moveRight", false);
        //Add touch support

        game.data.score = 0;
        game.data.start = false;
        game.data.newHiscore = false;

        me.game.world.addChild(new BackgroundLayer('bg', 13));

        
        //me.game.world.addChild(this.ground, 11);


        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
        
        //Life stuff


        this.life1 = me.pool.pull("life", 47, 8, 0);
        this.life2 = me.pool.pull("life", 112, 8, 1);
        this.life3 = me.pool.pull("life", 179, 8, 2);
        me.game.world.addChild(this.life1, 14);
        me.game.world.addChild(this.life2, 14);
        me.game.world.addChild(this.life3, 14);

        this.bird = me.pool.pull("footballer", (me.game.viewport.width / 2) - (70 / 2), me.game.viewport.height - 125);
       
        me.game.world.addChild(this.bird, 10);

        //inputs


        game.data.mDown = false;
        game.data.start = true;
        me.game.world.addChild(new PipeGenerator(), 0);
        me.game.world.addChild(new RewardGenerator(), 0);
        
        

    },


    onDestroyEvent: function() {
        this.HUD = null;
        this.bird = null;
        me.input.unbindKey(me.input.KEY.LEFT);
        me.input.unbindKey(me.input.KEY.RIGHT);
    }
});

game.GameOverScreen = me.ScreenObject.extend({

    init: function() {
        this.savedData = null;
        this.handler = null;
    },

    onResetEvent: function(type) {
        if(type === 'gameover') {
            game.data.score = 0;
            game.data.level = 1;
        } else if(type === 'level') {
    
        }
        game.data.finalSteps = game.data.steps;
       //Reset game data 

        
        game.data.lives = 3;
        
        game.data.originalSpeedModifier = 3;
        game.data.speedModifier = game.data.originalSpeedModifier;

        //save section
        this.savedData = {
            score: game.data.score,
            steps: game.data.steps
        };

        me.save.add(this.savedData);

        if (!me.save.topSteps) me.save.add({
            topSteps: game.data.steps
        });
        if (game.data.steps > me.save.topSteps) {
            me.save.topSteps = game.data.steps;
            game.data.newHiScore = true;
        }



        this.alwaysUpdate = true;
        if (game.data.completedGame) {
           // me.game.world.addChild(new GameOverBackground(0, 0, 'gameoverbg-2', 10));
            game.data.completedGame = false;
        } else {
           // me.game.world.addChild(new GameOverBackground(0, 0, 'gameoverbg', 10));
        }
    },
  

    onDestroyEvent: function() {
        // unregister the event
        this.font = null;
        me.audio.stop("outro");
    }
});

