// ship.js
// Dependencies: 
// Description: singleton object that is a module of app
// properties of the ship and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'ship' object literal is now a property of our 'app' global variable
app.Ship = function()
{
	function Ship(image, x, y, width, height, angle, color)
	{
		//instance variables of the ship
		this.position = new app.Vector(x,y);
		this.size = new app.Vector(width, height);
		this.angle = angle;
		this.angleChange = 4;
		
		//movement related variables
		this.isAccelerating = false;
		this.accelerationValue = 0.2;
		this.accelerationLimit = 0.1;
		this.acceleration = new app.Vector(0,0);
		this.velocity = new app.Vector(0,0);
		this.maxSpeed = 5;
		this.friction = .99;
		
		this.rotationAsRadians = (this.angle - 90) * (Math.PI/180);
		this.forward = new app.Vector(Math.cos(this.rotationAsRadians),Math.sin(this.rotationAsRadians));
		
		//health related variables
		this.health = 10;
		this.maxHealth = 10;
		this.lives = 1;
		this.startingLives = this.lives;
		this.isActive = true;
		this.isHit = false;
		this.isDead = false;
		
		//drawing variables
		this.color = color;
		this.image = image;
		
		//respawn variables
		this.respawnTimer = 0;
		this.timerStart = 50;
		this.spawnPosition = new app.Vector(x, y);
		this.spawnAngle = angle;
		
		// Bullet array
		this.bullets = [];
		
		//shooting related variables
		this.cooldown = 0;
		this.fireRate = 0.45;
		
		//image related variables

		this.setColor(color);
		this.sourceSize = new app.Vector(32, 32);
		
		// Exhaust
		this.exhaust = new app.Emitter();
		this.exhaust.numParticles = 100;
		this.exhaust.red = 255;
		this.exhaust.green = 150;
		this.exhaust.createParticles(this.emitterPoint());
		
		// Sound variables
		this.reviveSound = new Audio('audio/revive.mp3');
		this.engineSound = new Audio('audio/engine.mp3');
		this.engineSound.volume = 1.0;
		this.laserSound = new Audio('audio/laser.mp3');
		this.laserSound.volume = 0.2;
		this.hitSound = new Audio('audio/hit.mp3');
		this.hitSound.volume = 0.2;
	
	}; //constructor
	
	Ship.app = undefined;
	
	var p = Ship.prototype;
	
	p.draw = function(dt, ctx)
	{	
		if(this.isActive == true) {
			for (var i=0; i < this.bullets.length; i++) {
				this.bullets[i].draw(ctx);
			}
			
			// Draws the exhaust
			this.exhaust.draw(ctx, this.color);
		
			ctx.save();
		
			var center = new app.Vector(this.size.x/2, this.size.y/2);
			
			//if no image, draw a rectangle
			if(!this.image) 
			{
				app.DrawLib.drawRect(ctx, this.color, this.position, this.size, this.angle);
			} 
			else  //if image, draw that instead
			{
				var self = this;
				if(this.isHit == false)
				{
					app.DrawLib.drawImage(ctx, self.image, self.sourcePosition, self.sourceSize, self.position.difference(center), self.size, self.angle);
				}
				else
				{
					app.DrawLib.drawImage(ctx, self.image, self.hitSource, self.sourceSize, self.position.difference(center), self.size, self.angle);
					self.isHit = !self.isHit;
				}
			}
			
			//app.DrawLib.debugRect(ctx, this);

			ctx.restore();			
		}
	};
	
	//update
	p.update = function(dt) {	
	
		//update angle in radians
		this.rotationAsRadians = (this.angle - 90) * (Math.PI/180);
		this.calculateForward();
	
		//physics movement
		this.move(dt);
		this.wrap();

	
		//change cooldown
		this.cooldown --;
	
		// Move the bullets
		for (var i=0; i < this.bullets.length; i++) {
			this.bullets[i].update(dt);
		}
		this.bullets = this.bullets.filter(function (bullet){return bullet.active;});
		
		// Exhaust
		this.exhaust.update(this.emitterPoint());
		
		//respawn
		var self = this;
		if(this.health <= 0) 
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
				this.reviveSound.play();
			}
		}
	};
	
	//input methods
	//rotate: take a string representing the key input for rotation
	p.rotate = function(direction)
	{
		if(this.isActive)
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
		}
	};
	
	//move: takes delta time to affect the speed
	p.move = function(dt)
	{	
		var forwardAccel = this.forward.mult(this.accelerationValue)
		
		var self = this;
		if(this.isAccelerating)
		{
			this.engineSound.play();
			this.engineSound.loop = true;
			this.acceleration = new app.Vector(forwardAccel.x, forwardAccel.y);
			this.acceleration.limit(this.accelerationLimit);
			
			this.velocity = this.velocity.sum(this.acceleration);
			this.velocity.limit(this.maxSpeed);
		}
		
		this.engineSound.loop = false;
		//multiply the velocity by friction to slow
		this.velocity = this.velocity.mult(this.friction);
		
		// update the x and y of the player
		this.position = this.position.sum(this.velocity);
	};
	
	//shoot: spawn a bullet at the front of the ship
	p.shoot = function() {
	
		this.laserSound.play();
	
		if(this.cooldown <= 0 && this.isActive)
		{
			//reset cooldown
			this.cooldown = 60/this.fireRate;
			
			//spawn bullet code
			// Adjusts the x and y position so the bullet spawns on the front of the ship based on the ship's angle.
			
			var angleVec = new app.Vector(this.forward.x * (this.size.x/2), this.forward.y * (this.size.y/2));
			
			var sumVec = this.position.sum(angleVec);

			this.bullets.push(new this.app.Bullet(sumVec.x, sumVec.y, 400, this.angle, this.color));
		}
	};
	
	//bullet collision resolution
	p.bulletHit = function() {
		this.hitSound.play();
		this.health -= 1;
		this.isHit = true;
	};
	
	//respawn function
	p.respawn = function() {
		var self = this;
		
		//check if the ship is dead
		//If not, reset its stuff
		if(this.lives > 0)
		{
			self.position = self.spawnPosition;
			self.acceleration = new app.Vector(0,0);
			self.velocity = new app.Vector(0,0);
			self.bullets = [];
			self.angle = self.spawnAngle;
			self.health = self.maxHealth;
			self.lives--;
			self.isActive = true;
		}
		else
		{
			self.isDead = true;
		}
	};
	
	//calculate the forward vector
	p.calculateForward = function()
	{
		this.forward.x = Math.cos(this.rotationAsRadians);
		this.forward.y = Math.sin(this.rotationAsRadians);
	};
	
	
	//wrap around the screen
	p.wrap = function() {
		var self = this;
		
		var screenWidth = app.Cyber_Fighter.WIDTH;
		var screenHeight = app.Cyber_Fighter.HEIGHT;
		
		if(this.position.x > screenWidth + 10) {
			self.position.x = -5;
		}
		else if (this.position.x < -10)
		{
			self.position.x = screenWidth + 5;
		}
		
		if(this.position.y > (screenHeight - screenHeight/5) + 10) {
			self.position.y = -5;
		}
		else if (this.position.y < -10)
		{
			self.position.y = (screenHeight - screenHeight/5) + 5;
		}
	};
	
	//reset variables on the ship for playing again
	p.reset = function()
	{
		this.position = this.spawnPosition;
		this.acceleration = new app.Vector(0,0);
		this.velocity = new app.Vector(0,0);
		this.bullets = [];
		this.angle = this.spawnAngle;
		this.health = this.maxHealth;
		this.lives = this.startingLives;
		this.isActive = true;
		this.isHit = false;
		this.isDead = false;
		
		this.exhaust.createParticles(this.emitterPoint());
	};
	
	//calculate where the emitter point should be
	p.emitterPoint = function() {
		var angleVec = new app.Vector(Math.cos(this.rotationAsRadians) * (this.size.x/2), Math.sin(this.rotationAsRadians) * (this.size.y/2));	
		var differenceVec = this.position.difference(angleVec);
		
		return {x: differenceVec.x, y: differenceVec.y};
	};
	
	//set the color of the ship and adjust where the image is drawn from
	p.setColor = function(color) {
		this.color = color;
	
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
				this.sourcePosition = new app.Vector(col1, row1);
				this.hitSource = new app.Vector(col1, row3);
				break;
			case "orange":
				this.sourcePosition = new app.Vector(col2, row1);
				this.hitSource = new app.Vector(col2, row3);
				break;
			case "yellow":
				this.sourcePosition = new app.Vector(col3, row1);
				this.hitSource = new app.Vector(col3, row3);
				break;
			case "green":
				this.sourcePosition = new app.Vector(col1, row2);
				this.hitSource = new app.Vector(col1, row4);
				break;
			case "blue":
				this.sourcePosition = new app.Vector(col2, row2);
				this.hitSource = new app.Vector(col2, row4);
				break;
			case "purple":
				this.sourcePosition = new app.Vector(col3, row2);
				this.hitSource = new app.Vector(col3, row4);
				break;
		}
	};
	
	
	return Ship;
}();