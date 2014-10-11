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
    WIDTH : 600, 
    HEIGHT: 400,
	FIRE_RATE: 3,
	
	//properties
    canvas: undefined,
    ctx: undefined,
    ship: undefined,
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
			
			// set up player ship
			this.ship = ship;
			
			// Create and IMG object
			var image = new Image();
			
			// Get the ship PNG
			image.src = this.app.IMAGES['shipImage'];
			
			// Set .image property of ship
			this.ship.image = image;
			this.ship.init();

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
		this.drawLib.drawRect(this.ctx, "black", new app.vector(this.WIDTH/2,this.HEIGHT/2), new app.vector(this.WIDTH, this.HEIGHT));
		//Draw
		//this.drawLib.backgroundGradient(this.ctx, this.WIDTH, this.HEIGHT);
		
		// Draw the text
		//this.drawLib.text(this.ctx, "Score: " + this.score, 25, 25, 12, "yellow");
		
		// Draw the sprites
		this.ship.draw(this.ctx);
		
		// Draw the bullets
		for(var i = 0; i <this.playerBullets.length; i++) {
			this.playerBullets[i].draw(this.ctx);
		};
	},
	
	moveSprites: function() {
		if (this.app.keydown[this.app.KEYBOARD.KEY_LEFT]) {
			this.ship.moveLeft(this.dt);
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_RIGHT]) {
			this.ship.moveRight(this.dt);
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_DOWN]) {
			this.ship.moveDown(this.dt);
		}
		if (this.app.keydown[this.app.KEYBOARD.KEY_UP]) {
			this.ship.moveUp(this.dt);
		}
		
		var paddingX = this.ship.width/2;
		var paddingY = this.ship.height/2;
		this.ship.x = this.utils.clamp(this.ship.x, paddingX, this.WIDTH-paddingX);
		this.ship.y = this.utils.clamp(this.ship.y, paddingY, this.HEIGHT-paddingY);
		
		// Fire Bullets
		this.cooldown --;
		// Poll keyboard
		if (this.cooldown <= 0 && app.keydown[app.KEYBOARD.KEY_SPACE]) {
			this.shoot(this.ship.x - (paddingX+1), this.ship.y - paddingY);
			this.shoot(this.ship.x + (paddingX-1), this.ship.y - paddingY);
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
