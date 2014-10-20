"use strict";
var app = app || {};

// another IIFE!
app.Bullet = function() {
	function Bullet(x, y, speed, angle, color) {
		// ivars
		this.active = true;
		this.color = color;
		this.position = new app.Vector(x,y);
		this.size = new app.Vector(5, 5);
		this.speed = speed;
		this.angle = angle;
		
		//screen size
		this.screenWidth = app.Cyber_Fighter.WIDTH;
		this.screenHeight = app.Cyber_Fighter.HEIGHT;
	}
	
	var p = Bullet.prototype;
	p.update = function(dt, ctx) {
		var rotationAsRadians = (this.angle - 90) * (Math.PI/180);
		var vx = Math.cos(rotationAsRadians) * this.speed;
		var vy = Math.sin(rotationAsRadians) * this.speed;
		
		// update the x and y of the player
		this.position.x += vx * dt;
		this.position.y += vy * dt;
		
		if(checkBounds(this.position.x, this.position.y) == false) {
			this.active = false;
		}
	};
	
	p.draw = function(ctx) {
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "white";
		ctx.lineWidth = 0.75;
		ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
		ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
		ctx.restore();
	};
	
	// Private method
	function checkBounds(x, y) {
		if(x > app.Cyber_Fighter.WIDTH || x < 0) {
			return false;
		}
		if(y > app.Cyber_Fighter.HEIGHT || y < 0) {
			return false;
		}
		return true;
	};
	
	return Bullet;
}();