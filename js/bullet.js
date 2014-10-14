"use strict";
var app = app || {};

// another IIFE!
app.Bullet = function() {
	function Bullet(x, y, speed, angle) {
		// ivars
		this.active = true;
		this.width = 3;
		this.height = 3;
		this.color = "#FFFFFF";
		this.position = new app.vector(x,y);
		this.size = new app.vector(3, 3);
		this.speed = speed;
		this.angle = angle;
		
		//screen size
		this.screenWidth = app.cyber_fighter.WIDTH;
		this.screenHeight = app.cyber_fighter.HEIGHT;
	}
	
	var p = Bullet.prototype;
	p.update = function(dt, ctx) {

		
		var rotationAsRadians = (this.angle - 90) * (Math.PI/180);
		var vx = Math.cos(rotationAsRadians) * this.speed;
		var vy = Math.sin(rotationAsRadians) * this.speed;
		
		// update the x and y of the player
		this.position.x += vx * dt;
		this.position.y += vy * dt;
		
		//var changeVelocity = new app.vector(vx*dt, vy*dt);
		//this.position += changeVelocity;
		
		if(checkBounds(this.position.x, this.position.y, ctx) == false) {
			this.active = false;
			//console.log("A Bullet has been deactivated");
		}
	};
	
	p.draw = function(ctx) {
		//console.log("I just got drawn!!!");
		ctx.fillStyle = this.color;
		ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
	};
	
	// Private method
	function checkBounds(x, y, ctx) {
		if(x > app.cyber_fighter.WIDTH || x < 0) {
			return false;
		}
		if(y > app.cyber_fighter.HEIGHT || y < 0) {
			return false;
		}
		return true;
	};
	
	return Bullet;
}();