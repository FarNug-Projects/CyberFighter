/*
	Created originally for:
		Friendly Fire

		Alex Fuerst, 
		Mario Chuman,
		David Erbelding,
		Brian Nugent,
		Ryan Farrell,

		Game Design and Development 2
		10/3/2014

	Adapted for use in:
		cyber_fighter.exe
		
		Brian Nugent,
		Ryan Farrell

		Rich Web Media Development
		10/13/2014
*/

"use strict";

//Create the global app object if needed
var app = app || {};


app.drawLib = {

	//clear
	clear: function(ctx, x, y, w, h) {
		ctx.clearRect(x,y,w,h);
	},
	
	//draw a rectangle
	drawBackground: function(ctx, color, position, size) {
		ctx.save();
		ctx.fillStyle = color;
		ctx.fillRect(position.x, position.y ,size.x, size.y);
		ctx.restore();
	},

	//draw a rectangle
	drawRect: function(ctx, color, position, size, r) {
		ctx.save();
		ctx.translate(position.x - size.x/2,position.y-size.y/2);
		ctx.rotate(r);
		ctx.fillStyle = color;
		ctx.fillRect(-size.x/2,-size.y/2,size.x, size.y);
		ctx.restore();
	},
	
	//draw a given image using the context
	drawImage: function(ctx, img, sourcePos, sourceSize, position, size, r) {
		//setup the context
		ctx.save();
		ctx.translate(position.x,position.y);
		ctx.rotate(r * (Math.PI/180));
		
		//display image
		ctx.drawImage(img, sourcePos.x, sourcePos.y, sourceSize.x, sourceSize.y, -size.x/2, -size.y/2, size.x, size.y);
		ctx.restore();
	}

};