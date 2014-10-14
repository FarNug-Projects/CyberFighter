// ship.js
// Dependencies: 
// Description: singleton object that is a module of app
// properties of the ship and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'ship' object literal is now a property of our 'app' global variable
app.ship = function()
{
	function ship(image, x, y, width, height, angle, color)
	{
		//instance variables of the ship
		this.position = new app.vector(x,y);
		this.size = new app.vector(width, height);
		this.speed = 250;
		this.angle = angle;
		
		this.health = 10;
		this.lives = 2;
		this.isActive = true;
		
		//drawing variables
		this.color = color;
		this.image = image;
		switch(color)
		{
			case "red":
				this.sourcePosition = new app.vector(1, 1);
				break;
			case "orange":
				this.sourcePosition = new app.vector(34, 1);
				break;
			case "yellow":
				this.sourcePosition = new app.vector(67, 1);
				break;
			case "green":
				this.sourcePosition = new app.vector(1, 34);
				break;
			case "blue":
				this.sourcePosition = new app.vector(34, 34);
				break;
			case "purple":
				this.sourcePosition = new app.vector(67, 34);
				break;
		}
		this.sourceSize = new app.vector(32, 32);
		
		// Bullet array
		this.bullets = [];
		
		//shooting related variables
		this.cooldown = 0,
		this.fireRate = 0.75;
		
	}; //constructor
	
	ship.app = undefined;
	
	var p = ship.prototype;
	
	p.draw = function(dt, ctx)
	{	
		if(this.isActive == true) {
			ctx.save();
		
			var center = new app.vector(this.size.x/2, this.size.y/2);
			
			//if no image, draw a rectangle
			if(!this.image) 
			{
				app.drawLib.drawRect(ctx, this.color, this.position, this.size, this.angle);
			} 
			else  //if image, draw that instead
			{
				app.drawLib.drawImage(ctx, this.image, this.sourcePosition, this.sourceSize, this.position.difference(center), this.size, this.angle);this.position, this.size, this.angle
			}
			
			//app.drawLib.debugRect(ctx, this);

			ctx.restore();
			
			for (var i=0; i < this.bullets.length; i++) {
				this.bullets[i].draw(ctx);
			}
			
			this.update(dt);
		}
	};
	
	//input methods
	//rotate: take a string representing the key input for rotation
	p.rotate = function(direction)
	{
		switch(direction)
		{
			case "left":
				this.angle -= 2;
				break;
			case "right":
				this.angle += 2;
				break;
		}
	};
	
	//move: takes delta time to affect the speed
	p.move = function(dt)
	{
		var rotationAsRadians = (this.angle - 90) * (Math.PI/180);
		var vx = Math.cos(rotationAsRadians) * this.speed;
		var vy = Math.sin(rotationAsRadians) * this.speed;
		
		// update the x and y of the player
		this.position.x += vx * dt;
		this.position.y += vy * dt;
	};
	
	p.shoot = function() {
		if(this.cooldown <= 0)
		{
			//reset cooldown
			this.cooldown = 60/this.fireRate;
			
			//spawn bullet code
			// Adjusts the x and y position so the bullet spawns on the front of the ship based on the ship's angle.
			var rotationAsRadians = (this.angle - 90) * (Math.PI/180);
			var vx = Math.cos(rotationAsRadians) * (this.size.x/2);
			var vy = Math.sin(rotationAsRadians) * (this.size.y/2);
			var angleVec = new app.vector(vx, vy);
			
			var sumVec = this.position.sum(angleVec);

			//this.bullets.push(new this.app.Bullet(this.position.x - this.size.x/2, this.position.y - this.size.y/2, 200, this.angle));
			this.bullets.push(new this.app.Bullet(sumVec.x, sumVec.y, 200, this.angle));
		}
	};
	
	p.update = function(dt) {	
		//change cooldown
		this.cooldown --;
	
		// Move the bullets
		for (var i=0; i < this.bullets.length; i++) {
			this.bullets[i].update(dt);
		}
		this.bullets = this.bullets.filter(function (bullet){return bullet.active;});
		
		if(this.health == 0) {
			this.respawn();
		}
	};
	
	p.hit = function() {
		this.health -= 1;
	};
	
	p.respawn = function() {
		var self = this;
		
		if(this.lives == 0) {
			// GAME OVER FOR YOU
			self.isActive = false;
		} else {
			self.lives -= 0.5;
			self.isActive = false;
			// TELEPORT OFF SCREEN OR HAVE BULLETS CHECK FOR ACTIVE PLAYER
			setTimeout(function(){
				console.log("HEllo");
				self.health = 10;
				self.isActive = true;
			},1000);
		}
	};
	return ship;
}();