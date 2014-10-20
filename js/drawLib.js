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


app.DrawLib = {
	WIDTH: undefined,
	HEIGHT: undefined,
	
	init: function(cf)
	{
		this.WIDTH = cf.WIDTH;
		this.HEIGHT = cf.HEIGHT;
	},

	
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
	
	drawBackgroundWithStroke: function(ctx, fillColor, strokeColor, position, size) 
	{
		ctx.save();
		ctx.fillStyle = fillColor;
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = 1;
		ctx.fillRect(position.x, position.y ,size.x, size.y);
		ctx.strokeRect(position.x, position.y ,size.x, size.y);
		ctx.restore();
	},

	//draw a rectangle
	drawRect: function(ctx, color, position, size, r) {
		ctx.save();
		ctx.translate(position.x - size.x/2,position.y-size.y/2);
		ctx.rotate(r * (Math.PI/180));
		ctx.fillStyle = color;
		ctx.fillRect(-size.x/2,-size.y/2,size.x, size.y);
		ctx.restore();
	},
	
	
	/* Custom code for Cyberfighters*/
	drawGridBackground: function(ctx, position, size) {
		//set the background gradient
		
		ctx.save();
		
		this.drawBackground(ctx, "#008888", new app.Vector(0,0), new app.Vector(this.WIDTH, this.HEIGHT));
		
		//create black rectangles to fake a grid on the background
		var spacing = 40;
		ctx.save();
		for(var i = 0; i < size.y/ spacing; i++)
		{
			ctx.save();
			for(var j = 0; j < size.x/spacing; j++)
			{
				ctx.fillStyle = "black";
				ctx.fillRect(0,0,spacing-1,spacing-1);
				ctx.translate(spacing,0);
			}
			ctx.restore();
			ctx.translate(0,spacing);
		}
		ctx.restore();
		
	},
	
	
	
	//draw a given image using the context
	drawImage: function(ctx, img, sourcePos, sourceSize, position, size, r) {
		//setup the context
		ctx.save();
		//ctx.translate(position.x,position.y);
		ctx.translate(position.x + size.x/2,position.y+size.y/2);
		ctx.rotate(r * (Math.PI/180));
		
		//display image
		ctx.drawImage(img, sourcePos.x, sourcePos.y, sourceSize.x, sourceSize.y, -size.x/2, -size.y/2, size.x, size.y);
		ctx.restore();
	},
	
	//draws a stroke rectangle around where an object should be given it's position and size
	debugRect: function(ctx, object)
	{
		ctx.save();
		ctx.strokeStyle = "white";
		ctx.lineWidth = 5;
		ctx.strokeRect(object.position.x - object.size.x/2, object.position.y - object.size.y/2, object.size.x, object.size.y);
		ctx.restore();
	},
	
	//custom made for cyber_fighters
	drawText: function(ctx, string, font, fillColor, position)
	{
		ctx.save();
		ctx.font = font;
		ctx.fillStyle = fillColor;
		
		ctx.fillText(string, position.x, position.y);
		
		ctx.restore();
	}
};