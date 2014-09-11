var RewardEntity = me.ObjectEntity.extend({
    init: function(x, y, width) {
        var settings = {};


        var rewards = {};

        rewards[0] = {
            chance: 10,
            name: 'banana',
            points: 10,
            speed: 1,
            life: 0
        };
        rewards[1] = {
            chance: 5,
            name: 'bananaX5',
            points: 50,
            speed: 1,
            life: 0
        };
        rewards[2] = {
            chance: 10,
            name: 'grapes',
            points: 10,
            speed: 1,
            life: 0
        };
        rewards[3] = {
            chance: 5,
            name: 'grapesX2',
            points: 20,
            speed: 1,
            life: 0
        };
        rewards[4] = {
            chance: 10,
            name: 'orange',
            points: 10,
            speed: 1,
            life: 0
        };
        rewards[5] = {
            chance: 5,
            name: 'orangeX2',
            points: 20,
            speed: 1,
            life: 0
        };
        rewards[6] = {
            chance: 2,
            name: 'parrotgreen',
            points: 100,
            speed: 0.75,
            life: 0
        };
        rewards[7] = {
            chance: 2,
            name: 'parrotred',
            points: 100,
            speed: 0.75,
            life: 0
        };
        rewards[8] = {
            chance: 10,
            name: 'pear',
            points: 10,
            speed: 1,
            life: 0
        };
        rewards[9] = {
            chance: 5,
            name: 'pearX2',
            points: 20,
            speed: 1,
            life: 0
        };
        rewards[10] = {
            chance: 10,
            name: 'pineapple',
            points: 10,
            speed: 1,
            life: 0
        };
        rewards[11] = {
            chance: 5,
            name: 'pineappleX2',
            points: 20,
            speed: 1,
            life: 0
        };
        rewards[12] = {
            chance: 10,
            name: 'redcard',
            points: 0,
            speed: 1,
            life: -1
        };
        rewards[13] = {
            chance: 10,
            name: 'water',
            points: 10,
            speed: 1
        };
        rewards[14] = {
            chance: 5,
            name: 'waterX2',
            points: 50,
            speed: 1
        };
        rewards[15] = {
            chance: 15,
            name: 'yellowcard',
            points: -10,
            speed: 1.25,
            life: 0
        };

        var randomChoices = {};

        var counter = 0;
        var rewardsLength = Object.keys(rewards).length;
        for (var index = 0; index < rewardsLength; index++) {
            var chances = rewards[index].chance;
            for (var chance = 0; chance < chances; chance++) {
                randomChoices[counter] = index;
                counter++;
            }
        }

        var index = Number.prototype.random(0, Object.keys(randomChoices).length - 1);
        index = randomChoices[index];
        var reward = rewards[index];
        settings.image = me.loader.getImage('reward-' + reward.name);
        settings.width = 74;
        settings.height = 74;
        settings.spritewidth = 74;
        settings.spriteheight = 74;
        this.addShape(new me.Ellipse({
            x: 0,
            y: 0
        }, 74, 76));
        this.setShape(0);


        this.parent(x, y, settings);
        this.points = reward.points;
        this.speed = reward.speed;
        this.life = reward.life;
        this.alwaysUpdate = true;
        this.gravity = 2;
        this.updateTime = false;
        this.type = 'hit';
    },

    update: function(dt) {
        // mechanics
        if (game.data.start) {
            this.pos.add(new me.Vector2d(0, this.gravity * me.timer.tick * game.data.speedModifier));
            if (this.pos.y > 800) {
                me.game.world.removeChild(this);
            }
        }
        return true;
    },

});

var RewardGenerator = me.Renderable.extend({
    init: function() {
        this.parent(new me.Vector2d(), 0, 0);
        this.alwaysUpdate = true;
        this.generate = 180;
        this.pipeFrequency = 180;
        this.pipeHoleSize = 100;
        this.posY = -48 - 180;
    },

    update: function(dt) {

        if (this.generate > (this.pipeFrequency / game.data.speedModifier)) {
            this.generate = 0;
            var leftBorder = 86;
            var rightBorder = 86;
            var rewardWidth = 71;
            var rightBorder = 86;
            var gapWidth = 106.5;
            var cumulativeX = leftBorder;

            var maxCumulativeX = me.video.getWidth() - rightBorder;

            while (cumulativeX < maxCumulativeX) {
                var randomX = this.randomGap(gapWidth, 1, 5)
                var posX = cumulativeX + randomX;
                cumulativeX += randomX;
                cumulativeX += rewardWidth;




                if (cumulativeX > maxCumulativeX) {
                    break;
                }



                var reward = new me.pool.pull("reward", posX, this.posY, rewardWidth);

                me.game.world.addChild(reward, 10);

            }

        }
        this.generate++;
        return true;
    },

    randomGap: function(width, min, max) {
        if (typeof(min) === 'undefined') min = 1;
        if (typeof(max) === 'undefined') max = 2;

        return (Number.prototype.random(min, max) * width)
    },

    randomWidth: function(width) {
        return (Number.prototype.random(1, 4) * width)
    }

});

var HitEntity = me.ObjectEntity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = me.loader.getImage('hit');
        settings.width = 148;
        settings.height = 60;
        settings.spritewidth = 148;
        settings.spriteheight = 60;

        this.parent(x, y, settings);
        this.alwaysUpdate = true;
        this.gravity = 5;
        this.updateTime = false;
        this.type = 'hit';
        this.renderable.alpha = 0;
        this.ac = new me.Vector2d(-this.gravity, 0);
    },

    update: function() {

        if (game.data.start) {
            // mechanics
            this.pos.add(this.ac);
            if (this.pos.x < -148) {
                me.game.world.removeChild(this);
            }
        }
        return true;
    },

});