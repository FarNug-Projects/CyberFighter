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
		
		this.angleChange = 4;
		
		//health related variables
		this.health = 10;
		this.maxHealth = 10;
		this.lives = 2;
		this.isActive = true;
		this.isHit = false;
		
		//drawing variables
		this.color = color;
		this.image = image;
		
		//respawn variables
		this.respawnTimer = 0;
		this.timerStart = 50;
		this.spawnPosition = new app.vector(x, y);
		this.spawnAngle = angle;
		
		// Bullet array
		this.bullets = [];
		
		//shooting related variables
		this.cooldown = 0;
		this.fireRate = 0.75;
		
		//image related variables
		//source rows and columns
		var row1 = 1;
		var row2 = 34;
		var row3 = 67;
		var row4 = 100;
		var col1= 1;
		var col2= 34;
		var col3= 67;
		
		//figure out which part of the image based off of color
		switch(color)
		{	
			case "red":
				this.sourcePosition = new app.vector(col1, row1);
				this.hitSource = new app.vector(col1, row3);
				break;
			case "orange":
				this.sourcePosition = new app.vector(col2, row1);
				this.hitSource = new app.vector(col2, row3);
				break;
			case "yellow":
				this.sourcePosition = new app.vector(col3, row1);
				this.hitSource = new app.vector(col3, row3);
				break;
			case "green":
				this.sourcePosition = new app.vector(col1, row2);
				this.hitSource = new app.vector(col1, row4);
				break;
			case "blue":
				this.sourcePosition = new app.vector(col2, row2);
				this.hitSource = new app.vector(col2, row4);
				break;
			case "purple":
				this.sourcePosition = new app.vector(col3, row2);
				this.hitSource = new app.vector(col3, row4);
				break;
		}
		this.sourceSize = new app.vector(32, 32);
		
	}; //constructor
	
	ship.app = undefined;
	
	var p = ship.prototype;
	
	p.draw = function(dt, ctx)
	{	
		if(this.isActive == true) {
			for (var i=0; i < this.bullets.length; i++) {
				this.bullets[i].draw(ctx);
			}
		
			ctx.save();
		
			var center = new app.vector(this.size.x/2, this.size.y/2);
			
			//if no image, draw a rectangle
			if(!this.image) 
			{
				app.drawLib.drawRect(ctx, this.color, this.position, this.size, this.angle);
			} 
			else  //if image, draw that instead
			{
				var self = this;
				if(this.isHit == false)
				{
					app.drawLib.drawImage(ctx, self.image, self.sourcePosition, self.sourceSize, self.position.difference(center), self.size, self.angle);
				}
				else
				{
					app.drawLib.drawImage(ctx, self.image, self.hitSource, self.sourceSize, self.position.difference(center), self.size, self.angle);
					self.isHit = !self.isHit;
				}
			}
			
			//app.drawLib.debugRect(ctx, this);

			ctx.restore();
			
			this.update(dt);
		}
	};
	
	//update
	p.update = function(dt) {	
		//change cooldown
		this.cooldown --;
	
		// Move the bullets
		for (var i=0; i < this.bullets.length; i++) {
			this.bullets[i].update(dt);
		}
		this.bullets = this.bullets.filter(function (bullet){return bullet.active;});
		
		//respawn
		var self = this;
		if(this.health <= 0 && this.lives > 0) 
		{
			if(self.isActive)
			{
				self.respawnTimer = self.timerStart;
				self.isActive = false;
			}
			else
			{
				self.respawnTimer--;
			}
			
			if(self.respawnTimer <=0)
			{
				this.respawn();
			}
		}
	};
	
	//input methods
	//rotate: take a string representing the key input for rotation
	p.rotate = function(direction)
	{
		switch(direction)
		{
			case "left":
				this.angle -= this.angleChange;
				break;
			case "right":
				this.angle += this.angleChange;
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

			this.bullets.push(new this.app.Bullet(sumVec.x, sumVec.y, 200, this.angle));
		}
	};
	
	//bullet collision resolution
	p.bulletHit = function() {
		this.health -= 1;
		this.isHit = true;
	};
	
	//ship collision resolution
	p.shipHit = function() {
		this.health = 0;
		//this.isHit = true;
	};
	
	p.respawn = function() {
		var self = this;
		
		if(this.lives >0)
		{
			self.position = self.spawnPosition;
			self.angle = self.spawnAngle;
			self.health = self.maxHealth;
			self.lives--;
			self.isActive = true;
		}
		else
		{
			//gameover code
		}
	};
	return ship;
}();