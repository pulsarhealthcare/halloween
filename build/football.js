function isRetina (){
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
            (min--moz-device-pixel-ratio: 1.5),\
            (-o-min-device-pixel-ratio: 3/2),\
            (min-resolution: 1.5dppx)";
    if (window.devicePixelRatio > 1)
        return true;
    if (window.matchMedia && window.matchMedia(mediaQuery).matches)
        return true;
    return false;
}


var game = {
  data: {
    score : 0,
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
    user: 'Unknown',
    ignoreLoadingScreen: false
  },



  "onload": function(user, teamName) {
  		me.sys.pauseOnBlur = false;
  		this.data.teamName = teamName;


  		this.data.user = user;
/*   		console.log(this.data.user + 'sdf'); */
  		
  		var width = 1024;
  		var height = 768;
  		var scale = 1;
  		
 
	if (isRetina() &&  window.ontouchstart !== 'undefined') {
	  	
	    if (!me.video.init("screen", 1024, 768, false, 'auto')) {
	      alert("Your browser does not support HTML5 canvas.");
	      return;
	    }
	} else {
		 
	    if (!me.video.init("screen", 1024, 768, false)) {
	      alert("Your browser does not support HTML5 canvas.");
	      return;
	    }
 }
  		
    
    me.sys.fps = 30;

    me.audio.init("mp3");
    me.loader.onload = this.loaded.bind(this);
    me.loader.preload(game.resources);
    
    me.state.change(me.state.LOADING);
    
 
  },

  "loaded": function() {
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
		game.data.mDown = false;
/* 		console.log('mouseup'); */
	});
	
	me.input.registerPointerEvent("pointerdown", me.game.viewport, function(e) {
		game.data.mDown = true;
		console.log('mDown');
		
		if (me.state.isCurrent(me.state.GAME_OVER)) { 
			if (me.input.mouse.pos.x <  (me.video.getWidth() / 2)) {
      
		 	 		var win = window.open('./leader-board.html?teamName=' + encodeURIComponent(game.data.teamName) + '&oponentTeamKey='+game.data.oponentTeamKey + '&selectedTeamKey='+game.data.selectedTeamKey, '_self');
		 	 } else {
	      
			  	me.state.change(me.state.PLAY); 
		
			 }
		}
	});
	console.log('State to play');
	
/*     me.plugin.register(debugPanel, "debug"); */
/* 	    me.plugin.debug.hide() ; */

    // in melonJS 1.0.0, viewport size is set to Infinity by default
    
	if (isRetina() &&  window.ontouchstart !== 'undefined') {
/*     me.game.viewport.setBounds(0, 0, 1024, 768); */
} else {
/*     me.game.viewport.setBounds(0, 0, 2048, 1536); */
}
    me.state.change(me.state.PLAY);
  }
};

game.resources = [
   
   //Header Background
	 {name: "bg", type:"image", src: "data/img/bg.png"},


	 {name: "footballer-red", type:"image", src: "img/char_pumpkin.png"},
	 
	 {name: "players-red", type:"image", src: "img/enemy_ghosts.png"},


	 {name: "reward-bananaX5", type:"image", src: "img/reward_01.png"},
	 {name: "reward-grapes", type:"image", src: "img/reward_02.png"},
	 {name: "reward-grapesX2", type:"image", src: "img/reward_03.png"},


	 {name: "ground-1", type:"image", src: "img/bg_graveyard.png"},
	 {name: "ground-2", type:"image", src: "data/img/bg-2.jpg"},
	 {name: "ground-3", type:"image", src: "data/img/bg-3.jpg"},

	 {name: "gameoverbg", type:"image", src: "data/img/gameoverbg.jpg"},
	 {name: "gameoverbg-2", type:"image", src: "data/img/gameoverbg-2.jpg"},
	 {name: "hit", type:"image", src: "data/img/hit.png"},
	 {name: "life", type:"image", src: "data/img/life.png"},
	 {name: "transparent", type:"image", src: "data/img/transparent.png"},



	 {name: "intro", type: "audio", src: "data/bgm/"},
	 {name: "crowd", type: "audio", src: "data/bgm/"},
	 {name: "outro", type: "audio", src: "data/bgm/"},
	 {name: "disapointment", type: "audio", src: "data/sfx/"},
	 {name: "hit-1", type: "audio", src: "data/sfx/"},
	 {name: "hit-2", type: "audio", src: "data/sfx/"},
	 {name: "hit-3", type: "audio", src: "data/sfx/"},

	 
/* 	 {name: "hit", type: "audio", src: "data/sfx/"}, */
/* 	 {name: "lose", type: "audio", src: "data/sfx/"}, */
];

game.shirtColors = {
	'algeria' : 'white',
	'argentina' : 'white',
	'brazil' : 'orange',
	'cameroon' : 'green',
	'england' : 'red',
	'france' : 'white',
	'germany' : 'red',
	'greece' : 'blue',
	'italy' : 'blue',
	'japan' : 'blue',
	'mexico' : 'green',
	'portugal' : 'red',
	'russia' : 'red',
	'southkorea' : 'red',
	'usa' : 'blue'
	
	
	
};

var FootballerEntity = me.ObjectEntity.extend({
  init: function(x, y) {
    var settings = {};
    settings.image = me.loader.getImage('footballer-red');
    settings.width = 75;
    settings.height = 91;
    settings.spritewidth = 75;
    settings.spriteheight= 91;

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
    
	this.addShape(new me.Rect({x:10, y:8}, 55, 70));
	
/* 	console.log('touch?: ' + is_touch_device()); */

  },

  update: function(dt) {
    // mechanics
    if (game.data.start) {
    	
/*     	console.log(me.input.mouse); */
      if (me.input.isKeyPressed('moveLeft') || (game.data.mDown && is_touch_device() &&  me.input.mouse.pos.x <  (me.video.getWidth() / 2))) {
        this.pos.x-=8;
      } else if (me.input.isKeyPressed('moveRight') || (game.data.mDown && is_touch_device() && me.input.mouse.pos.x > (me.video.getWidth() / 2))) {
        this.pos.x+=8;
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
      
      game.data.steps+=res.obj.points;
      
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
			this.pos.x = (me.game.viewport.width / 2) - (70/2);
			return this.parent(dt);
		}
      
    }
    
    
      
      if (game.data.speedModifier != game.data.originalSpeedModifier) {
      	game.data.speedCounter++;
	  	}
	  	
      if ( game.data.speedCounter >= 5 * 60 ) {
	  		game.data.speedModifier = game.data.originalSpeedModifier; 
	  		game.data.speedCounter = 0;
      } 
      

    return this.parent(dt);

  },

});


var PipeEntity = me.ObjectEntity.extend({
  init: function(x, y, width) {
    var settings = {};
    settings.image = me.loader.getImage('players-red');
    settings.width = width;
    settings.height= 48;
    settings.spritewidth = width;
    settings.spriteheight= 48;


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
    }
    return true;
  },

});



var GameOverBackground = me.ObjectEntity.extend({
  init: function(x, y, image, z) {
    var settings = {};
    settings.image = me.loader.getImage(image);
    settings.width = 1024;
    settings.height= 768;
    settings.spritewidth = 1024;
    settings.spriteheight= 768;



    this.parent(x, y, settings);
  },

 
 update: function () {
/*       	console.log('updatinh'); */
      	if (game.data.mDown) {
	      
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
		
      
      var pipe1 = new me.pool.pull("pipe", posX1, this.posY, width1);
      var pipe2 = new me.pool.pull("pipe", posX2, this.posY, width2);
     
      if (showPipeThree) {
      	var pipe3 = new me.pool.pull("pipe", posX3, this.posY, width3);
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
  
  randomGap : function(width, min, max) {
	  if(typeof(min)==='undefined') min = 1;
	  if(typeof(max)==='undefined') max = 2;
   
	  return (Number.prototype.random(min, max) * width)
  },
  
  randomWidth : function(width) {
	  return (Number.prototype.random(1, 4) * width)
  }

});


var RewardEntity = me.ObjectEntity.extend({
  init: function(x, y, width) {
    var settings = {};
    
    
    var rewards = {};
    
    rewards[0] = { chance: 10, name : 'banana', points : 10, speed : 1, life: 0};
    rewards[1] = { chance: 5, name : 'bananaX5', points : 50, speed : 1, life: 0 };
    rewards[2] = { chance: 10, name : 'grapes', points : 10, speed : 1, life: 0 };
    rewards[3] = { chance: 5, name : 'grapesX2', points : 20, speed : 1, life: 0 };
    rewards[4] = { chance: 10, name : 'orange', points : 10, speed : 1, life: 0 };
    rewards[5] = { chance: 5, name : 'orangeX2', points : 20, speed : 1, life: 0 };
    rewards[6] = { chance: 2, name : 'parrotgreen', points : 100, speed : 0.75, life: 0 };
    rewards[7] = { chance: 2, name : 'parrotred', points : 100, speed : 0.75, life: 0 };
    rewards[8] = { chance: 10, name : 'pear', points : 10, speed : 1, life: 0 };
    rewards[9] = { chance: 5, name : 'pearX2', points : 20, speed : 1, life: 0 };
    rewards[10] = { chance: 10, name : 'pineapple', points : 10, speed : 1, life: 0 };
    rewards[11] = { chance: 5, name : 'pineappleX2', points : 20, speed : 1, life: 0 };
    rewards[12] = { chance: 10, name : 'redcard', points : 0, speed : 1, life: -1 };
    rewards[13] = { chance: 10, name : 'water', points : 10, speed : 1 };
    rewards[14] = { chance: 5, name : 'waterX2', points : 50, speed : 1 };
    rewards[15] = { chance: 15, name : 'yellowcard', points : -10, speed : 1.5, life: 0 };
    
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
    settings.height= 74;
    settings.spritewidth = 74;
    settings.spriteheight= 74;
	this.addShape(new me.Ellipse({x:0, y:0}, 74, 76));
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
  
  randomGap : function(width, min, max) {
	  if(typeof(min)==='undefined') min = 1;
	  if(typeof(max)==='undefined') max = 2;
   
	  return (Number.prototype.random(min, max) * width)
  },
  
  randomWidth : function(width) {
	  return (Number.prototype.random(1, 4) * width)
  }

});

var HitEntity = me.ObjectEntity.extend({
  init: function(x, y) {
    var settings = {};
    settings.image = me.loader.getImage('hit');
    settings.width = 148;
    settings.height= 60;
    settings.spritewidth = 148;
    settings.spriteheight= 60;

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


var Ground = me.ObjectEntity.extend({
  init: function(x, y, scroll) {
    var settings = {};
    settings.image = me.loader.getImage('ground-' + game.data.level);
    settings.width = 1024;
    settings.height= 2729;
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

  update: function () { return true; }
})

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

  draw: function (context) {
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

  draw: function (context) {
    if (me.state.isCurrent(me.state.MENU) || (game.data.start && me.state.isCurrent(me.state.PLAY) && this.alpha == 1)) {
      this.stepsFont.draw(context, 'LEVEL ' + game.data.level, me.video.getWidth() / 2, (me.video.getHeight() / 2) - 36);
     var tween = new me.Tween(this).to({ alpha : 0}, 10000);
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
    settings.spriteheight= 59;

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


game.PlayScreen = me.ScreenObject.extend({
  init: function() {
  },

  onResetEvent: function() {
    me.audio.stop("crowd");
    me.audio.stop("intro");
    me.audio.play("crowd", true);
    
  $('#backgroundaudio').trigger('pause');
    	
    		
    me.audio.play("intro", true);
    
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

    this.bird = me.pool.pull("footballer", (me.game.viewport.width / 2) - (70/2) , me.game.viewport.height - 125);
    me.game.world.addChild(this.bird, 10);

    //inputs
    me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.RIGHT);
	game.data.mDown = false;
	game.data.start = true;
	me.game.world.addChild(new PipeGenerator(), 0);
	me.game.world.addChild(new RewardGenerator(), 0);
	
	
	
  },  


  onDestroyEvent: function() {
    me.audio.stopTrack('crowd');
    me.audio.stop("intro");
    // free the stored instance
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
    
    
    
    
    me.audio.stop("crowd");
    me.audio.play("outro");
    
    //save section
    this.savedData = {
      score: game.data.score,
      steps: game.data.steps
    };
    
    me.save.add(this.savedData);
    
    if (!me.save.topSteps) me.save.add({topSteps: game.data.steps});
    if (game.data.steps > me.save.topSteps) {
      me.save.topSteps = game.data.steps;
      game.data.newHiScore = true;
    }


    /*var gImage =  me.loader.getImage('gameover');
    me.game.world.addChild(new me.SpriteObject(
        me.video.getWidth()/2 - gImage.width/2,
        me.video.getHeight()/2 - gImage.height/2 - 100,
        gImage
    ), 12);
*/


	
	
    this.alwaysUpdate = true;
    if (game.data.completedGame) {
		me.game.world.addChild(new GameOverBackground(0,0,'gameoverbg-2', 10));
	    game.data.completedGame = false;
    } else {
		me.game.world.addChild(new GameOverBackground(0,0,'gameoverbg', 10));
    }
  },
/*     me.game.world.addChild(new BackgroundLayer('bg', 1)); */

    // add the dialog witht he game information
  /*  if (game.data.newHiScore) {
      var newRect = new me.SpriteObject(
          235,
          355,
          me.loader.getImage('new')
      );
      me.game.world.addChild(newRect, 12);
    }

    this.dialog = new (me.Renderable.extend({
      // constructor
      init: function() {
          // size does not matter, it's just to avoid having a zero size
          // renderable
          this.parent(new me.Vector2d(), 100, 100);
          this.font = new me.Font('gamefont', 40, 'black', 'left');
          this.steps = 'Steps: ' + game.data.steps.toString();
          this.topSteps= 'Higher Step: ' + me.save.topSteps.toString();
      },
*/
     
  /*    draw: function (context) {
        var stepsText = this.font.measureText(context, this.steps);
        var topStepsText = this.font.measureText(context, this.topSteps);

        var scoreText = this.font.measureText(context, this.score);
        //steps
        this.font.draw(
            context,
            this.steps,
            me.game.viewport.width/2 - stepsText.width/2 - 60,
            me.game.viewport.height/2
        );
        //top score
        this.font.draw(
            context,
            this.topSteps,
            me.game.viewport.width/2 - stepsText.width/2 - 60,
            me.game.viewport.height/2 + 50
        );

      }
    }));
    me.game.world.addChild(this.dialog, 12);*/


  onDestroyEvent: function() {
    // unregister the event
    this.font = null;
    me.audio.stop("outro");
  }
});

var LeaderButton = me.GUI_Object.extend(
{	
	init:function(x, y)
	{
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
	}, onClick : function (event) {
	 var win = window.open('./leader-board.html', '_blank');
  win.focus();
        // don't propagate the event
        return false;
    }
});

var PlayButton = me.GUI_Object.extend(
{	
	init:function(x, y)
	{
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
	}, onClick : function (event) { 
        // don't propagate the event
        return false;
    }
});

function pad(number) {
    return Array(Math.max(4 - String(number).length + 1, 0)).join(0) + number;
}


function is_touch_device() {
    return !!('ontouchstart' in window);
 }
