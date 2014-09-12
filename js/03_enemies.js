var PipeEntity = me.ObjectEntity.extend({
    init: function(x, y, width, image) {
        var settings = {};
        settings.image = me.loader.getImage('enemy-'+image);
        settings.width = width;
        settings.height = 48;
        settings.spritewidth = width;
        settings.spriteheight = 48;


        this.parent(x, y, settings);
        this.alwaysUpdate = true;
        this.gravity = 2;
        this.updateTime = false;

    },

    update: function(dt) {
        // mechanics
        this.pos.add(new me.Vector2d(0, this.gravity * me.timer.tick * game.data.speedModifier));
        if (this.pos.y > 800) {
            me.game.world.removeChild(this);
            var index = refPool.indexOf(this);
            refPool.splice(index, 1);
        }
        return true;
    },

});


var PipeGenerator = me.Renderable.extend({
    init: function() {
        this.parent(new me.Vector2d(), 0, 0);
        this.alwaysUpdate = true;
        this.generate = 180;
        this.pipeFrequency = 180;
        this.pipeHoleSize = 100;
        this.posY = -48;
    },

    update: function(dt) {

        if (this.generate > (this.pipeFrequency / game.data.speedModifier)) {
            this.generate = 0;
            var cumulativeX = 0;

            var leftBorder = 86;
            var rightBorder = 86;
            var playerWidth = 71;
            var rightBorder = 86;
            var gapWidth = 106.5;

            var maxCumulativeX = me.video.getWidth() - rightBorder;


            var posX1 = leftBorder + this.randomGap(gapWidth, 0, 2);
            cumulativeX += posX1;

            var width1 = this.randomWidth(playerWidth);
            cumulativeX += width1;

            var posX2 = cumulativeX + this.randomGap(gapWidth);
            cumulativeX = posX2;

            var width2 = this.randomWidth(playerWidth);
            cumulativeX += width2;



            if (cumulativeX > maxCumulativeX) {
                cumulativeX -= width2;
                width2 = maxCumulativeX - posX2;
                width2 = Math.floor(width2 / playerWidth) * playerWidth;
                cumulativeX += width2;

            }

            var posX3 = cumulativeX + this.randomGap(gapWidth);
            cumulativeX = posX3;

            var width3 = this.randomWidth(playerWidth);
            cumulativeX += width3;



            if (cumulativeX > maxCumulativeX) {
                cumulativeX -= width3;
                width3 = maxCumulativeX - posX3;
                width3 = Math.floor(width3 / playerWidth) * playerWidth;
                cumulativeX += width3;

            }


            var showPipeThree = true;

            if (width3 < playerWidth) {
                showPipeThree = false;
            }
            //Pipes here
            var enemys = [];
            enemys[0] = ['pumpkins_gy','skulls_gy','spiders_gy','spiders_gy'];  
            enemys[2] = ['ghosts_sw','skulls0_sw','spiders_sw','skulls_sw'];
            enemys[1] = ['skeletons_hh','skulls_hh','skulls0_hh','spiders_hh'];

            var random =  Math.floor(Math.random() * 3) ;

            var pipe1 = new me.pool.pull("pipe", posX1, this.posY, width1, enemys[game.data.level-1][random]);
            var pipe2 = new me.pool.pull("pipe", posX2, this.posY, width2, enemys[game.data.level-1][random]);
            
            refPool.push(pipe1);
            refPool.push(pipe2);

            
            if (showPipeThree) {
                var pipe3 = new me.pool.pull("pipe", posX3, this.posY, width3,enemys[game.data.level-1][random]);
                refPool.push(pipe3);
            }

            /*       pipe1.renderable.flipX(); */
            me.game.world.addChild(pipe1, 10);
            me.game.world.addChild(pipe2, 10);

            if (showPipeThree) {
                me.game.world.addChild(pipe3, 10);
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
