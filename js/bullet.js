"use strict";
var app = app || {};

// another IIFE!
app.Bullet = function() {
	function Bullet(x, y, speed, angle) {
		// ivars
		this.active = true;
		//this.xVelocity = 0;
		//this.yVelocity = -speed;
		this.width = 3;
		this.height = 3;
		this.color = "#FFFFFF";
		
		// Improved code
		this.position = new app.vector(x,y);
		this.speed = speed;
		this.angle = angle;
	}
	
	var p = Bullet.prototype;
	p.update = function(dt) {

		
		var rotationAsRadians = (this.angle - 90) * (Math.PI/180);
		var vx = Math.cos(rotationAsRadians) * this.speed;
		var vy = Math.sin(rotationAsRadians) * this.speed;
		
		// update the x and y of the player
		this.position.x += vx * dt;
		this.position.y += vy * dt;
		
		//var changeVelocity = new app.vector(vx*dt, vy*dt);
		//this.position += changeVelocity;
		
		this.active = this.active && inBounds(this.position.y);
	};
	
	p.draw = function(ctx) {
		console.log("I just got drawn!!!");
		ctx.fillStyle = this.color;
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
	};
	
	// Private method
	function inBounds(y) {
		return y >= -10;
	};
	
	return Bullet;
}();