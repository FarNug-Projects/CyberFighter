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
    WIDTH : 1000, 
    HEIGHT: 600,
	SHIP_WIDTH: 34,
	SHIP_HEIGHT: 42,
	//FIRE_RATE: 3,
	
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
		this.player1.update(this.dt);
		this.player2.update(this.dt);
		
		// Check for collisions
		this.checkForCollisions();
		
		// Draw
		this.drawSprites();
	},
	
	drawSprites: function() {
		//draw background
		this.drawLib.drawBackground(this.ctx, "black", new app.vector(0, 0), new app.vector(this.WIDTH, this.HEIGHT));
		
		// Draw the sprites
		this.player1.draw(this.dt, this.ctx);
		this.player2.draw(this.dt, this.ctx);
	},
	
	moveSprites: function() {
	
	},
	
	checkForCollisions: function() {
		var self = this;
		
		//Player 1 vs Player 2 bullets
		this.player2.bullets.forEach(function(bullet)
		{
			if(self.collides(bullet, self.player1))
			{
				//collision stuff
				console.log("Player 1 shot");
			}
		});
		
		//Player 2 vs Player 1 bullets
		this.player1.bullets.forEach(function(bullet)
		{
			if(self.collides(bullet, self.player2))
			{
				//collision stuff
				console.log("Player 2 shot");
			}
		
		});
	},
	
	collides: function(a,b) {
		//a = sprite 1, b = sprite 2
		var ax = a.position.x - a.size.x/2;
		var ay = a.position.y - a.size.y/2;
		var bx = b.position.x - b.size.x/2;
		var by = b.position.y - b.size.y/2;
		
		return ax < bx + b.size.x && ax + a.size.x > bx && ay < by + b.size.y && ay + a.size.y > by;
	},
	
	
	handleKeyboard: function()
	{
		//Player 1 input
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
		
		//Player 2 input
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
