// ship.js
// Dependencies: 
// Description: singleton object that is a module of app
// properties of the ship and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'ship' object literal is now a property of our 'app' global variable
app.ship = {
	color: "grey",
	x: 320,
	y: 420,
	width: 34,
	height: 42,
	speed: 250,
	image: undefined,
	drawLib: undefined,
	exhaust: undefined,
	
	init: function(){
		console.log("app.ship.init() called");
	},
	
	draw: function(ctx){
		var halfW = this.width/2;
		var halfH = this.height/2;
		
		if(!this.image) {
			this.drawLib.rect(ctx, this.x - halfW, this.y - halfH, this.width, this.height, this.color);
		} else {
			ctx.drawImage(this.image, 28, 2, 17, 21, this.x - halfW, this.y - halfH, this.width, this.height);
		}
	},
	
	moveLeft: function(dt) {
		this.x -= this.speed * dt;
	},
	
	moveRight: function(dt) {
		this.x += this.speed * dt;
	},
	
	moveDown: function(dt) {
		this.y += this.speed * dt;
	},
	
	moveUp: function(dt) {
		this.y -= this.speed * dt;
	}
};