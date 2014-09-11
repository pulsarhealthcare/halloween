var FootballerEntity = me.ObjectEntity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = me.loader.getImage('footballer-' + game.shirtColors[game.data.selectedTeamKey]);
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


    },

    update: function(dt) {
        // mechanics
        if (game.data.start) {

            if (!is_touch_device()) {

                if (me.input.isKeyPressed('moveLeft')) {
                    this.pos.x -= 8;
                } else if (me.input.isKeyPressed('moveRight')) {
                    this.pos.x += 8;
                }

            } else {

                if (game.data.isDown) {

                    if (me.input.mouse.pos.x > game.data.prevX) {

                        this.pos.x += me.input.mouse.pos.x - game.data.prevX;
                    } else {
                        this.pos.x -= game.data.prevX - me.input.mouse.pos.x;
                    }
                    game.data.prevX = me.input.mouse.pos.x;
                }
            }
        }

        var ignoreDeath = false;
        if (game.data.ignoreHitsCounter > 0) {
            game.data.ignoreHitsCounter--;
            ignoreDeath = false;

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

                me.audio.play("disapointment");
                me.device.vibrate(500);
                if (game.data.lives > 0) {
                    game.data.ignoreHitsCounter = 160 / game.data.speedModifier;
                    return this.parent(dt);
                } else {

                    me.state.change(me.state.GAME_OVER);
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
            me.audio.play('hit-' + audioChance);

        } else {

            me.device.vibrate(500);
            var hitLeft = 60; // bird height + 20px
            var hitRight = me.game.viewport.width - 60 - 71;
            if (this.pos.x >= hitRight || this.pos.x <= hitLeft) {
                me.audio.play("disapointment");
                me.device.vibrate(500);
                game.data.lives--;
                if (game.data.lives <= 0) {

                    me.state.change(me.state.GAME_OVER);
                    return false;
                }

                game.data.ignoreHitsCounter = 160 / game.data.speedModifier;
                this.pos.x = (me.game.viewport.width / 2) - (70 / 2);
                return this.parent(dt);
            }

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