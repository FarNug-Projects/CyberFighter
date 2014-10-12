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
		
		//drawing variables
		this.color = color;
		this.image = image;
		this.sourcePosition = new app.vector(28, 2);
		this.sourceSize = new app.vector(17, 21);
		
	}; //constructor
	
	ship.app = undefined;
	
	var p = ship.prototype;
	
	/*init: function(){
		console.log("app.ship.init() called");
	},*/
	
	p.draw = function(ctx)
	{	
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
		console.log("Move called");
		var rotationAsRadians = (this.angle - 90) * (Math.PI/180);
		var vx = Math.cos(rotationAsRadians) * this.speed;
		var vy = Math.sin(rotationAsRadians) * this.speed;
		
		// update the x and y of the player
		this.position.x += vx * dt;
		this.position.y += vy * dt;
	};
	
	return ship;
}();