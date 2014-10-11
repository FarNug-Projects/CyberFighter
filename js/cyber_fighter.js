/*
	cyber_fighter.exe

	Brian Nugent,
	Ryan Farrell

	Rich Web Media Development
*/

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.cyber_fighter = {
	// CONSTANT properties
    WIDTH : 800, 
    HEIGHT: 600,
	FIRE_RATE: 3,
	
	//properties
    canvas: undefined,
    ctx: undefined,
    playerOneShip: undefined,
	playerTwoShip: undefined,
	drawLib: undefined,
	dt: 1/60.0, 
	app: undefined,
	utils: undefined,
	playerBullets: [],
	cooldown: 0,
    
    // methods
	init : function(ship) {
			console.log("app.cyber_fighter.init called");
			// declare properties
			this.canvas = document.querySelector('canvas');
			this.canvas.width = this.WIDTH;
			this.canvas.height = this.HEIGHT;
			this.ctx = this.canvas.getContext('2d');
			
			// Set up both ships
			this.playerOneShip = ship;
			this.playerTwoShip = ship;
			
			// Create and IMG object
			var p1image = new Image();
			var p2image = new Image();
			
			// Get the ship PNG
			p1image.src = this.app.IMAGES['shipImage'];
			p2image.src = this.app.IMAGES['shipImage'];
			
			// Set .image property of ship
			this.playerOneShip.image = p1image;
			this.playerOneShip.init();
			this.playerTwoShip.image = p2image;
			this.playerTwoShip.init();

			this.update();
	},
	
	update: function() {
		//this.drawLib.clear(this.ctx, 0, 0, this.WIDTH, this.HEIGHT);
		// Loop
		requestAnimationFrame(this.update.bind(this));
		
		// Update
		this.moveSprites();
		
		// Check for collisions
		this.checkForCollisions();
		
		// Draw
		this.drawSprites();
	},
	
	drawSprites: function() {
		// Draw background
		this.drawLib.drawRect(this.ctx, "black", new app.vector(this.WIDTH/2,this.HEIGHT/2), new app.vector(this.WIDTH, this.HEIGHT));
		//Draw
		//this.drawLib.backgroundGradient(this.ctx, this.WIDTH, this.HEIGHT);
		
		// Draw the text
		//this.drawLib.text(this.ctx, "Score: " + this.score, 25, 25, 12, "yellow");
		
		// Draw the sprites
		this.playerOneShip.draw(this.ctx);
		this.playerTwoShip.draw(this.ctx);
		
		// Draw the bullets
		for(var i = 0; i <this.playerBullets.length; i++) {
			this.playerBullets[i].draw(this.ctx);
		};
	},
	
	moveSprites: function() {
		// Player One controls
		if (this.app.keydown[this.app.KEYBOARD.KEY_A]) {
			this.playerOneShip.moveLeft(this.dt);
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_D]) {
			this.playerOneShip.moveRight(this.dt);
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_S]) {
			this.playerOneShip.moveDown(this.dt);
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_W]) {
			this.playerOneShip.moveUp(this.dt);
		}
		
		var paddingX = this.playerOneShip.width/2;
		var paddingY = this.playerOneShip.height/2;
		this.playerOneShip.x = this.utils.clamp(this.playerOneShip.x, paddingX, this.WIDTH-paddingX);
		this.playerOneShip.y = this.utils.clamp(this.playerOneShip.y, paddingY, this.HEIGHT-paddingY);
		
		// Player Two controls
		if (this.app.keydown[this.app.KEYBOARD.KEY_LEFT]) {
			this.playerTwoShip.moveLeft(this.dt);
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_RIGHT]) {
			this.playerTwoShip.moveRight(this.dt);
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_DOWN]) {
			this.playerTwoShip.moveDown(this.dt);
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_UP]) {
			this.playerTwoShip.moveUp(this.dt);
		}
		
		var paddingX = this.playerTwoShip.width/2;
		var paddingY = this.playerTwoShip.height/2;
		this.playerTwoShip.x = this.utils.clamp(this.playerTwoShip.x, paddingX, this.WIDTH-paddingX);
		this.playerTwoShip.y = this.utils.clamp(this.playerTwoShip.y, paddingY, this.HEIGHT-paddingY);
		
		// Fire Bullets
		this.cooldown --;
		// Player One shooting poll
		if (this.cooldown <= 0 && app.keydown[app.KEYBOARD.KEY_F]) {
			this.shoot(this.playerOneShip.x - (paddingX+1), this.playerOneShip.y - paddingY);
			this.shoot(this.playerOneShip.x + (paddingX-1), this.playerOneShip.y - paddingY);
			this.cooldown = 60/this.FIRE_RATE;
		}
		// Player Two shooting poll
		if (this.cooldown <= 0 && app.keydown[app.KEYBOARD.KEY_CTRL]) {
			this.shoot(this.playerTwoShip.x - (paddingX+1), this.playerTwoShip.y - paddingY);
			this.shoot(this.playerTwoShip.x + (paddingX-1), this.playerTwoShip.y - paddingY);
			this.cooldown = 60/this.FIRE_RATE;
		}
		
		// Move the bullets
		for (var i=0; i < this.playerBullets.length; i++) {
			this.playerBullets[i].update(this.dt);
		}
		
		this.playerBullets = this.playerBullers = this.playerBullets.filter(function(bullet) {
			return bullet.active;
		});
	},
	
	checkForCollisions: function() {
		var self = this;
		
		// Bullets vs enemies
		/*this.playerBullets.forEach(function(bullet) {
			self.enemies.forEach(function(enemy) {
				if(self.collides(bullet, enemy)) {
					enemy.active = false;
					//enemy.explode();
					bullet.active = false;
					self.score++;
				} // End of the if
			}); // End of the enemy forEach
		}); // End of the bullet forEach
		
		// Enemies vs ship
		this.enemies.forEach(function(enemy) {
			if (self.collides(enemy, self.ship)) {
				enemy.explode();
				//self.ship.explode();
				self.score -=5;
			}
		});
		//console.log("Score: " + this.score);*/
	},
	
	collides: function(a,b) {
		//a = sprite 1, b = sprite 2
		var ax = a.x - a.width/2;
		var ay = a.y - a.height/2;
		var bx = b.x - b.width/2;
		var by = b.y - b.height/2;
		
		return ax < bx + b.width && ax + a.width > bx && ay < by + b.height && ay + a.height > by;
	},
	
	shoot: function(x, y) {
		//console.log("Bang!");
		this.playerBullets.push(new app.Bullet(x, y, 200));
	}
}
