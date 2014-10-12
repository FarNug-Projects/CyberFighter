/*
	cyber_fighter.exe
	
	Brian Nugent,
	Ryan Farrell

	Rich Web Media Development
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
	drawBackground: function(ctx, color, position, size, r) {
		ctx.save();
		ctx.translate(position.x,position.y);
		ctx.rotate(r);
		ctx.fillStyle = color;
		ctx.fillRect(-size.x/2,-size.y/2,size.x, size.y);
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
	},

	//draws a stroke rectangle around where an object should be given it's position and size
	debugRect: function(ctx, object) {
		ctx.save();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 5;
		ctx.strokeRect(object.position.x - object.size.x/2, object.position.y - object.size.y/2, object.size.x, object.size.y);
		ctx.restore();
	},

};