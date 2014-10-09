"use strict";
var app = app || {};

// another IIFE!
app.Bullet = function() {
	function Bullet(x, y, speed) {
		// ivars
		this.x = x;
		this.y = y;
		this.active = true;
		this.xVelocity = 0;
		this.yVelocity = -speed;
		this.width = 3;
		this.height = 3;
		this.color = "#FFFFFF";
	}
	
	var p = Bullet.prototype;
	p.update = function(dt) {
		this.x += this.xVelocity * dt;
		this.y += this.yVelocity * dt;
		this.active = this.active && inBounds(this.y);
	};
	
	p.draw = function(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	
	// Private method
	function inBounds(y) {
		return y >= -10;
	};
	
	return Bullet;
}();