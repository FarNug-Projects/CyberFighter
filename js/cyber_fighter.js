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
	SHIP_WIDTH: 34,
	SHIP_HEIGHT: 42,
	FIRE_RATE: 3,
	
	//properties
    canvas: undefined,
    ctx: undefined,
    ship: undefined,
	drawLib: undefined,
	dt: 1/60.0, 
	app: undefined,
	utils: undefined,
	//playerBullets: [],
	cooldown: 0,
	player1: undefined,
	player2: undefined,
    
    // methods
	init : function() {
			console.log("app.cyber_fighter.init called");
			// declare properties
			this.canvas = document.querySelector('canvas');
			this.canvas.width = this.WIDTH;
			this.canvas.height = this.HEIGHT;
			this.ctx = this.canvas.getContext('2d');
			
			/* Player 1 ship */
			// Create and IMG object
			var image = new Image();
			
			// Get the ship PNG
			image.src = this.app.IMAGES['shipImage'];
			
			// set up player ship
			this.player1 = new app.ship(image,this.WIDTH/4, this.HEIGHT-100, this.SHIP_WIDTH, this.SHIP_HEIGHT, 0, "red")
			
			/* Player 2 ship */
			this.player2 = new app.ship(image,this.WIDTH/2, this.HEIGHT-200, this.SHIP_WIDTH, this.SHIP_HEIGHT, 0, "red")

			this.update();
	},
	
	update: function() {
		//this.drawLib.clear(this.ctx, 0, 0, this.WIDTH, this.HEIGHT);
		// Loop
		requestAnimationFrame(this.update.bind(this));
		
		//handle input
		this.handleKeyboard();
		
		// Update
		//this.moveSprites();
		/*this.player1.handleBullets(this.dt, this.ctx);
		this.player2.handleBullets(this.dt, this.ctx);*/
		
		// Check for collisions
		//this.checkForCollisions();
		
		// Draw
		this.drawSprites();
	},
	
	drawSprites: function() {
		this.drawLib.drawBackground(this.ctx, "black", new app.vector(this.WIDTH/2,this.HEIGHT/2), new app.vector(this.WIDTH, this.HEIGHT));
		//Draw
		//this.drawLib.backgroundGradient(this.ctx, this.WIDTH, this.HEIGHT);
		
		
		// Draw the sprites
		this.player1.draw(this.dt, this.ctx);
		this.player2.draw(this.dt, this.ctx);
	},
	
	shoot: function(x, y) {
		//console.log("Bang!");
		this.player1Bullets.push(new app.Bullet(x, y, 200));
	},
	
	moveSprites: function() {
	
	},
	
	/*checkForCollisions: function() {
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
		//console.log("Score: " + this.score);
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
	},*/
	
	handleKeyboard: function()
	{
		//player 1 input
		if(this.app.keydown[this.app.KEYBOARD.KEY_A])
		{
			this.player1.rotate("left", this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_D])
		{
			this.player1.rotate("right", this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_W])
		{
			this.player1.move(this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_F])
		{
			this.player1.shoot();
		}
		//player 2 input
		if(this.app.keydown[this.app.KEYBOARD.KEY_J])
		{
			this.player2.rotate("left", this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_L])
		{
			this.player2.rotate("right", this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_I])
		{
			this.player2.move(this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_H])
		{
			this.player2.shoot();
		}
	}
}
