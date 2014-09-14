var character = getUrlVars('char');
var isGameOverScreen = false;

var isInputDown = false;


var isNewLevel = true;
var isNewGame = true;
var oldTime = 0;
var curTime = 0;
var Character = me.ObjectEntity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = me.loader.getImage('character-' + character.char);
        settings.width = 75;
        settings.height = 91;
        settings.spritewidth = 75;
        settings.spriteheight = 91;

        this.parent(x, y, settings);
        this.alwaysUpdate = true;
        this.gravity = 0.2;
        this.gravityForce = 0.01;
        this.maxAngleRotation = Number.prototype.degToRad(30);
        this.maxAngleRotationDown = Number.prototype.degToRad(90);
        this.renderable.addAnimation("running", [0, 1], 200);
        this.renderable.addAnimation("invincible", [2, 3, 4, 5], 200);
        this.renderable.addAnimation("idle", [0]);
        this.renderable.setCurrentAnimation("running");
        this.isRunning = true;
        this.animationController = 0;

        this.addShape(new me.Rect({
            x: 10,
            y: 8
        }, 55, 70));
        new TheGround;
        /*  console.log('touch?: ' + is_touch_device()); */

    },

    update: function(dt) {
        

        //Game loop

        //console.log(me.input.mouse.pos)


        if (game.data.start) {

            if(is_touch_device()) {

            }
            if (me.input.isKeyPressed('moveLeft')) {
                this.pos.x -= 8;
            } else if (me.input.isKeyPressed('moveRight')) {
                this.pos.x += 8;
            }
        }

        

        var time = Math.round(me.timer.getTime() / 1000);

        var screens = ['screen_graveyard', 'screen_swamp', 'screen_hauntedhouse'];

        if (isNewLevel) {
            //Stop game 
            me.state.pause();
             //Clear stage
            for (var x = 0; x < refPool.length; x++) {
                me.game.world.removeChild(refPool[x]);
            }
            //Reset Game if New

            if(isNewGame) {
                 game.data.lives = 3;
                 game.data.level = 1;
                 isNewGame = false;
            }

            //Show title screen
            var lvlScreen = new BackgroundLayer(screens[game.data.level - 1], 21);
            me.game.world.addChild(lvlScreen);
            
           

            setTimeout(function() {
                //Update game
                oldTime = time;
                new TheGround;
                me.state.resume();
                isNewLevel = false;
                setTimeout(function() {
                    me.game.world.removeChild(lvlScreen);
                }, 20)
            }, 1000)

        } else {
            curTime = (time - oldTime);
            if(curTime === 10) {
                if(game.data.level === 3) {
                  var lvlScreen = new BackgroundLayer('congratulationsbg', 21);
                    me.game.world.addChild(lvlScreen);
                    refPool.push(lvlScreen);
                    me.state.pause();
                    isGameOverScreen = true;
                } else {
                  isNewLevel = true;
                  game.data.level ++;  
                }
                
            }
        }







        var ignoreDeath = false;
        if (game.data.ignoreHitsCounter > 0) {
            game.data.ignoreHitsCounter--;
            ignoreDeath = true;

            if (this.isRunning) {
                this.isRunning = false;
                this.renderable.setCurrentAnimation("invincible");
            }
        } else {
            if (!this.isRunning) {
                this.isRunning = true;
                this.renderable.setCurrentAnimation("running");
            }
        }
        var res = me.game.world.collide(this);

        if (res && !ignoreDeath) {

            if (res.obj.type != 'hit' || res.obj.life == -1) {

                if (res.obj.life == -1) {
                    me.game.world.removeChildNow(res.obj);
                }
                game.data.lives--;

                me.device.vibrate(500);
                if (game.data.lives > 0) {
                    game.data.ignoreHitsCounter = 160 / game.data.speedModifier;
                    return this.parent(dt);
                } else {
                  
                    var lvlScreen = new BackgroundLayer('gameoverbg', 21);
                    me.game.world.addChild(lvlScreen);
                    refPool.push(lvlScreen);
                    me.state.pause();
                    isGameOverScreen = true;

                    return false;
                }
            }
            // remove the hit box
            me.game.world.removeChildNow(res.obj);
            // the give dt parameter to the update function
            // give the time in ms since last frame
            // use it instead ?

            var speed = res.obj.speed;

            if (speed != 1) {
                game.data.speedCounter = 0;
                game.data.speedModifier = game.data.speedModifier * res.obj.speed;
            }

            game.data.steps += res.obj.points;

            var audioChance = Number.prototype.random(0, 2) + 1;

        } 


        if (game.data.speedModifier != game.data.originalSpeedModifier) {
            game.data.speedCounter++;
        }

        if (game.data.speedCounter >= 5 * 60) {
            game.data.speedModifier = game.data.originalSpeedModifier;
            game.data.speedCounter = 0;
        }


        return this.parent(dt);

    },

});