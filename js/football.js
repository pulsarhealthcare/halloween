var GameOverBackground = me.ObjectEntity.extend({
    init: function(x, y, image, z) {
        var settings = {};
        settings.image = me.loader.getImage(image);
        settings.width = 1024;
        settings.height = 768;
        settings.spritewidth = 1024;
        settings.spriteheight = 768;



        this.parent(x, y, settings);
    },


    update: function() {
        /*        console.log('updatinh'); */
        if (game.data.mDown) {

        }
        return true;
    },



});


game.PlayScreen = me.ScreenObject.extend({
    init: function() {},

    onResetEvent: function() {

        game.data.speedModifier = game.data.originalSpeedModifier;
        game.data.speedCounter = 0;

        me.input.bindKey(me.input.KEY.LEFT, "moveLeft", false);
        me.input.bindKey(me.input.KEY.RIGHT, "moveRight", false);
        game.data.score = 0;
        game.data.start = false;
        game.data.newHiscore = false;

        me.game.world.addChild(new BackgroundLayer('bg', 13));

        this.ground = new TheGround(true);
        me.game.world.addChild(this.ground, 11);


        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);

        this.life1 = me.pool.pull("life", 47, 8, 0);
        this.life2 = me.pool.pull("life", 112, 8, 1);
        this.life3 = me.pool.pull("life", 179, 8, 2);
        me.game.world.addChild(this.life1, 14);
        me.game.world.addChild(this.life2, 14);
        me.game.world.addChild(this.life3, 14);

        this.bird = me.pool.pull("footballer", (me.game.viewport.width / 2) - (70 / 2), me.game.viewport.height - 125);
        me.game.world.addChild(this.bird, 10);

        //inputs

        me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.RIGHT);

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

    onResetEvent: function() {

        game.data.finalSteps = game.data.steps;

        var myRootRef = new Firebase('https://pulsario.firebaseio.com/results');
        myRootRef.push({
            userID: game.data.user.uid,
            score: game.data.finalSteps,
            teamName: game.data.teamName
        });

        game.data.steps = 0;
        game.data.lives = 3;
        game.data.level = 1;
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
            me.game.world.addChild(new GameOverBackground(0, 0, 'gameoverbg-2', 10));
            game.data.completedGame = false;
        } else {
            me.game.world.addChild(new GameOverBackground(0, 0, 'gameoverbg', 10));
        }
    },
  

    onDestroyEvent: function() {
        // unregister the event
        this.font = null;
        me.audio.stop("outro");
    }
});

