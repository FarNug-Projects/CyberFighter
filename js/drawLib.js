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

	//draw a rectangle
	drawRect: function(ctx, color, position, size, r) {
		ctx.save();
		ctx.translate(position.x - size.x/2,position.y-size.y/2);
		ctx.rotate(r * (Math.PI/180));
		ctx.fillStyle = color;
		ctx.fillRect(-size.x/2,-size.y/2,size.x, size.y);
		ctx.restore();
	},
	
	//Draw the interface
	//custom made for cyber_fighters
	drawPlayInterface: function(ctx, player1, player2, interfaceColor, infoColor) {
		// Draws the "ui"
		var interfacePos = new app.vector(0, this.HEIGHT - (this.HEIGHT/5)); 
		var interfaceSize = new app.vector(this.WIDTH, (this.HEIGHT/5));

		var padding = 125;
		
		
		var infoBoxSize =  new app.vector(225, 75);
		var p1InfoBoxPos =  new app.vector(padding, interfacePos.y + ((interfaceSize.y/2) - (infoBoxSize.y/2)));
		var p2InfoBoxPos =  new app.vector(this.WIDTH - infoBoxSize.x - padding, interfacePos.y + ((interfaceSize.y/2) - (infoBoxSize.y/2)));

		
		// Draw the interface box
		this.drawBackground(ctx, interfaceColor, interfacePos, interfaceSize);
		// Draw the player 1 info box
		this.drawBackground(ctx, infoColor, p1InfoBoxPos, infoBoxSize);
		// Draw the player 2 info box
		this.drawBackground(ctx, infoColor, p2InfoBoxPos, infoBoxSize);
		
		
		//Draw health and lives text
		var healthPadding = 10;
		var healthHeight =  p1InfoBoxPos.y + (infoBoxSize.y/2);
		
		//drawText(ctx, string, font, fillColor, position)
		this.drawText(ctx, "Health:", "16pt Play", "white", new app.vector(p1InfoBoxPos.x + healthPadding* 2, healthHeight- healthPadding));
		this.drawText(ctx, "Health:", "16pt Play", "white", new app.vector(p2InfoBoxPos.x + healthPadding* 2, healthHeight- healthPadding));
		
		this.drawText(ctx, "Lives: ", "16pt Play", "white", new app.vector(p1InfoBoxPos.x + healthPadding* 2, healthHeight+ healthPadding*2));
		this.drawText(ctx, "Lives: ", "16pt Play", "white", new app.vector(p2InfoBoxPos.x + healthPadding* 2, healthHeight+ healthPadding*2));
		this.drawText(ctx, player1.lives + 1, "16pt Play", "white", new app.vector(p1InfoBoxPos.x + (healthPadding* 10) + 50, healthHeight+ healthPadding*2));
		this.drawText(ctx, player2.lives + 1, "16pt Play", "white", new app.vector(p2InfoBoxPos.x + (healthPadding* 10) + 50, healthHeight+ healthPadding*2));
		
		// Draws player 1 health to the screen
		for(var i=0; i < player1.health; i++) {
			this.drawRect(ctx, player1.color, new app.vector(p1InfoBoxPos.x + (infoBoxSize.x/2) + healthPadding*(i+1), healthHeight- healthPadding/2), new app.vector(healthPadding, 20), 0);
		}
		// Draws player 2 health to the screen
		for(var i=0; i < player2.health; i++) {
			this.drawRect(ctx, player2.color, new app.vector(p2InfoBoxPos.x + (infoBoxSize.x/2) + healthPadding*(i+1), healthHeight- healthPadding/2), new app.vector(healthPadding, 20), 0);
		}
		
		//draw the ship images
		var shipSize = new app.vector(50,50);
		var shipBackgroundSize = new app.vector(60,75);
		var ship1Pos = new app.vector(p1InfoBoxPos.x - 50, p1InfoBoxPos.y + 10);
		var ship2Pos = new app.vector(p2InfoBoxPos.x - 50, p1InfoBoxPos.y + 10);
		
		this.drawBackground(ctx, infoColor, new app.vector(ship1Pos.x-10,ship1Pos.y - shipBackgroundSize.y/8 -0.5), shipBackgroundSize);
		this.drawBackground(ctx, infoColor, new app.vector(ship2Pos.x-10,ship2Pos.y - shipBackgroundSize.y/8 -0.5), shipBackgroundSize);
		
		this.drawImage(ctx, player1.image, player1.sourcePosition , player1.sourceSize, ship1Pos, shipSize, 90);
		this.drawImage(ctx, player2.image, player2.sourcePosition, player2.sourceSize, ship2Pos, shipSize, 90);
	},
	
	//
	drawGridBackground: function(ctx, position, size) {
		//set the background gradient
		
		ctx.save();
		
		this.drawBackground(ctx, "#008888", new app.vector(0,0), new app.vector(this.WIDTH, this.HEIGHT));
		
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