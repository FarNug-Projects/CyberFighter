/*
	cyber_fighter.exe

	Brian Nugent,
	Ryan Farrell

	Rich Web Media Development
*/

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.Interface = {

	WIDTH: 0,
	HEIGHT: 0,
	buttons: undefined,
	buttonClickDelay: 0,
	cyberFighters: undefined,
	DrawLib: undefined,
	colorArray: undefined,
	player1: undefined,
	player2: undefined,
	p1ColorIndex: 0,
	p2ColorIndex: 4,
	previousP1Index: 0,
	previousP2Index: 0,
	

	init : function(cyberFighter) 
	{
		this.cyberFighters = cyberFighter;
		this.WIDTH = cyberFighter.WIDTH;
		this.HEIGHT = cyberFighter.HEIGHT;
		this.colorArray = ["red", "orange", "yellow", "green", "blue", "purple"];
		
		this.buttons = 
		{
			//button(text, font, fontColor, image,x,y,width,height) 
			"menuPlayButton" : new app.Button("FIGHT", "24pt Play", "white", undefined, this.WIDTH/2, this.HEIGHT/2, 175, 50), 
			"menuCustomButton" : new app.Button("CUSTOMIZE", "22pt Play", "white", undefined, this.WIDTH/2, this.HEIGHT/2 + 75, 175, 50),
			"overMenuButton" : new app.Button("MENU", "24pt Play", "white", undefined, this.WIDTH/2, (this.HEIGHT /2) + 130, 175, 50),
			"overPlayButton" : new app.Button("REMATCH", "24pt Play", "white", undefined, this.WIDTH/2, (this.HEIGHT /2) + 60, 175, 50),
			"customMenuButton" : new app.Button("MENU", "24pt Play", "white", undefined, this.WIDTH/9 + 10, this.HEIGHT/10, 175, 50),
			"pausePlayButton" : new app.Button("RESUME", "24pt Play", "white", undefined, this.WIDTH/2, (this.HEIGHT /2) - 35, 175, 50), 
			"pauseMenuButton" : new app.Button("QUIT", "24pt Play", "white", undefined, this.WIDTH/2, (this.HEIGHT /2) + 35, 175, 50),
			"controlPlayButton" : new app.Button("CONTINUE", "24pt Play", "white", undefined, this.WIDTH/2, this.HEIGHT -(this.HEIGHT /9) + 5, 175, 50),
			"p1ColorLeft" : new app.Button("<", "24pt Play", "white", undefined, ((this.WIDTH/16) * 1) + 66, ((this.HEIGHT/8) * 5) + 43, 30, 30),
			"p1ColorRight" : new app.Button(">", "24pt Play", "white", undefined, ((this.WIDTH/16) * 4) + 60, ((this.HEIGHT/8) * 5) + 43, 30, 30),
			"p2ColorLeft" : new app.Button("<", "24pt Play", "white", undefined, ((this.WIDTH/16) * 12) - 60, ((this.HEIGHT/8) * 5) + 43, 30, 30),
			"p2ColorRight" : new app.Button(">", "24pt Play", "white", undefined, ((this.WIDTH/16) * 15) -  68, ((this.HEIGHT/8) * 5) + 43, 30, 30),
				
		};
		
		//this.cyberFighters.update();
	},
		
	updateMainMenu: function(dt) //update the main menu
	{
		this.buttonClickDelay += dt;
		
		if(this.buttonClickDelay >= 0.5)
		{
			if (this.buttonClicked("menuPlayButton")) 
			{
				this.cyberFighters.currentState = this.cyberFighters.gameState.control;
				this.cyberFighters.player1.reset();
				this.cyberFighters.player2.reset();
				this.buttons["menuPlayButton"].clickResolution();
				this.buttonClickDelay = 0;
			}
			if (this.buttonClicked("menuCustomButton")) 
			{
				this.cyberFighters.currentState = this.cyberFighters.gameState.custom;
				this.buttons["menuCustomButton"].clickResolution();
				this.buttonClickDelay = 0;
			}
		}
	},
	
	drawMainMenu: function(ctx) //draw the main menu
	{
		//drawBackground(ctx, color, position, size) 
		var backgroundHeightPadding = 50;
		app.DrawLib.drawBackgroundWithStroke(ctx, "black", "#008888", new app.Vector(this.WIDTH/3, backgroundHeightPadding/2), new app.Vector(this.WIDTH/3, this.HEIGHT - backgroundHeightPadding) );
		app.Interface.buttons["menuPlayButton"].draw(ctx, app.mouse);
		this.buttons["menuCustomButton"].draw(ctx, app.mouse);
		
		ctx.save();
		ctx.textAlign = "center";
		this.DrawLib.drawText(ctx, "Ryan Farrell & Brian Nugent 2014", "12pt Play", "white",  new app.Vector(this.WIDTH/2, this.HEIGHT - 50));
		ctx.restore();
	},
	
	updateGameOver: function(dt) //update the game over screen
	{
		this.buttonClickDelay += dt;
			
		if(this.buttonClickDelay >= 0.5)
		{
			if (this.buttonClicked("overPlayButton")) {
				
				this.cyberFighters.currentState = this.cyberFighters.gameState.play;
				this.player1.reset();
				this.player2.reset();
				
				this.buttons["overPlayButton"].clickResolution();
				
				this.buttonClickDelay = 0;
				
			}
			if (this.buttonClicked("overMenuButton")) {
				this.cyberFighters.currentState = this.cyberFighters.gameState.mainMenu;
				this.buttons["overMenuButton"].clickResolution();
				this.buttonClickDelay = 0;
			}
		}
	},
	
	drawGameOver: function(ctx) //draw the game over screen
	{
		//drawText(ctx, string, font, fillColor, position)
		ctx.save();
		
		var backgroundHeightPadding = 150;
		this.DrawLib.drawBackgroundWithStroke(ctx, "black", "#008888", new app.Vector(this.WIDTH/10, backgroundHeightPadding/2), new app.Vector(4*this.WIDTH/5, this.HEIGHT - backgroundHeightPadding) );
		
		ctx.textAlign = "center";
		
		var textPad = 50;
		
		this.DrawLib.drawText(ctx, "GAME OVER", "40pt Play", "#008888",  new app.Vector(this.WIDTH/2, this.HEIGHT/4 + textPad));
		if(this.player2.isDead) {
			this.DrawLib.drawText(ctx, "Player One Wins!", "40pt Play", this.player1.color,  new app.Vector(this.WIDTH/2, 2*(this.HEIGHT/5) + textPad));
		}
		if(this.player1.isDead) {
			this.DrawLib.drawText(ctx, "Player Two Wins!", "40pt Play", this.player2.color,  new app.Vector(this.WIDTH/2, 2*(this.HEIGHT/5) + textPad));
		}
		if(this.player1.isDead && this.player2.isDead) {
			this.DrawLib.drawText(ctx, "Draw", "40pt Play", "#008888",  new app.Vector(this.WIDTH/2, 2*(this.HEIGHT/4)));
		}
		this.buttons["overPlayButton"].draw(ctx, app.mouse);
		this.buttons["overMenuButton"].draw(ctx, app.mouse);
		ctx.restore();
	},
	
	drawControls: function(ctx) //draw the controls screen
	{
		//drawText(ctx, string, font, fillColor, position)
		this.buttons["controlPlayButton"].draw(ctx, app.mouse);
	},
	
	updateControls: function(dt) //update the controls screen
	{
		this.buttonClickDelay += dt;
			
		if(this.buttonClickDelay >= 0.5)
		{
			if (this.buttonClicked("controlPlayButton")) {
				this.cyberFighters.currentState = this.cyberFighters.gameState.play;
				this.buttons["controlPlayButton"].clickResolution();
				this.buttonClickDelay = 0;
			}
		}
	},
	
	drawPause: function(ctx) //draw the pause menu
	{
		//drawText(ctx, string, font, fillColor, position)
		app.DrawLib.drawBackgroundWithStroke(ctx, "black", "#008888", new app.Vector(this.WIDTH/3,this.HEIGHT/4), new app.Vector(this.WIDTH/3, this.HEIGHT/2) );
		this.buttons["pauseMenuButton"].draw(ctx, app.mouse);
		this.buttons["pausePlayButton"].draw(ctx, app.mouse);
	},
	
	updatePause: function(dt) //update the pause menu
	{
		this.buttonClickDelay += dt;
			
		if(this.buttonClickDelay >= 0.5)
		{
			if (this.buttonClicked("pausePlayButton")) {
				
				this.cyberFighters.currentState = this.cyberFighters.gameState.play;
				this.buttons["pausePlayButton"].clickResolution();
				this.buttonClickDelay = 0;
				
			}
			if (this.buttonClicked("pauseMenuButton")) {
				this.cyberFighters.currentState = this.cyberFighters.gameState.mainMenu;
				this.buttons["pauseMenuButton"].clickResolution();
				this.buttonClickDelay = 0;
			}
		}
	},
	
	updateCustomMenu: function(dt) //update custom
	{
		this.buttonClickDelay += dt;
		
		this.prevousP1Index = this.p1ColorIndex;
		this.prevousP2Index = this.p2ColorIndex;
			
		if(this.buttonClickDelay >= 0.5)
		{
			if (this.buttonClicked("customMenuButton")) {
			
				this.cyberFighters.currentState = this.cyberFighters.gameState.mainMenu;
				this.buttons["customMenuButton"].clickResolution();
				this.buttonClickDelay = 0;
			}
			
			//Customization Code			
			if(this.buttonClicked("p1ColorLeft")) {
				//check if a skip is necessary
				if(this.p1ColorIndex == this.p2ColorIndex + 1)
				{
					this.p1ColorIndex --;
				}
				else if(this.p1ColorIndex == 0 && this.p2ColorIndex == 5)
				{
					this.p1ColorIndex--;
				}
				this.p1ColorIndex--;
				this.buttons["p1ColorLeft"].clickResolution();
				this.buttonClickDelay = 0;
			}
			
			if(this.buttonClicked("p1ColorRight")) {
				//check if a skip is necessary
				if(this.p1ColorIndex == this.p2ColorIndex - 1)
				{
					this.p1ColorIndex ++;
				}
				else if(this.p1ColorIndex == 5 && this.p2ColorIndex == 0)
				{
					this.p1ColorIndex++;
				}
				this.p1ColorIndex++;
				this.buttons["p1ColorRight"].clickResolution();
				this.buttonClickDelay = 0;
			}
			
			if(this.buttonClicked("p2ColorLeft")) {
				//check if a skip is necessary
				if(this.p2ColorIndex == this.p1ColorIndex + 1)
				{
					this.p2ColorIndex --;
				}
				else if(this.p2ColorIndex == 0 && this.p1ColorIndex == 5)
				{
					this.p2ColorIndex--;
				}
				this.p2ColorIndex--;
				this.buttons["p2ColorLeft"].clickResolution();
				this.buttonClickDelay = 0;
			}
			
			if(this.buttonClicked("p2ColorRight")) {
				//check if a skip is necessary
				if(this.p2ColorIndex == this.p1ColorIndex - 1)
				{
					this.p2ColorIndex ++;
				}
				else if(this.p2ColorIndex == 5 && this.p1ColorIndex == 0)
				{
					this.p2ColorIndex++;
				}
				this.p2ColorIndex++;
				this.buttons["p2ColorRight"].clickResolution();
				this.buttonClickDelay = 0;
			}
		}
		
		//check if the index has changed
		if(this.p1ColorIndex != this.previousP1Index)
		{
			//set the index to the correct value if it's > 6 or < 0
			switch(this.p1ColorIndex)
			{
				case -1:
					this.p1ColorIndex = 5;
					break;
				case -2:
					this.p1ColorIndex = 4;
					break;
				case 6:
					this.p1ColorIndex = 0;
					break;
				case 7:
					this.p1ColorIndex = 1;
					break;
			}
			
			//set the color of the ship to the appropriate index
			this.player1.setColor(this.colorArray[this.p1ColorIndex]);
		}
		//check if the index has changed
		if(this.p2ColorIndex != this.previousP2Index)
		{
			//set the index to the correct value if it's > 6 or < 0
			switch(this.p2ColorIndex)
			{
				case -1:
					this.p2ColorIndex = 5;
					break;
				case -2:
					this.p2ColorIndex = 4;
					break;
				case 6:
					this.p2ColorIndex = 0;
					break;
				case 7:
					this.p2ColorIndex = 1;
					break;
			}
			
			//set the color of the ship to the appropriate index
			this.player1.setColor(this.colorArray[this.p1ColorIndex]);
			this.player2.setColor(this.colorArray[this.p2ColorIndex]);
		}
	},
	
	drawCustomMenu: function(ctx) //draw the customization menu
	{
		var boxWidth = this.WIDTH/4;
		var boxHeight = this.HEIGHT/2;
		
	
		this.buttons["customMenuButton"].draw(ctx, app.mouse);
		
		this.DrawLib.drawBackgroundWithStroke(ctx, "black", "#008888", new app.Vector((this.WIDTH/12) + 10, (this.HEIGHT/10) * 3), new app.Vector(boxWidth, boxHeight));
		this.buttons["p1ColorLeft"].draw(ctx, app.mouse);
		this.buttons["p1ColorRight"].draw(ctx, app.mouse);
		ctx.save();
		ctx.textAlign = "center";
		this.DrawLib.drawText(ctx, "COLOR", "22pt Play", "white",  new app.Vector((this.WIDTH/5) + 20, this.HEIGHT - (this.HEIGHT/3) + 28));
		ctx.restore();
		
		ctx.save();
		ctx.textAlign = "center";
		this.DrawLib.drawText(ctx, "Player 1", "26pt Play", "white",  new app.Vector((this.WIDTH/5) + 20, this.HEIGHT - (this.HEIGHT/3) - 170));
		ctx.restore();
		
		
		this.DrawLib.drawBackgroundWithStroke(ctx, "black", "#008888", new app.Vector((this.WIDTH/12) * 7 + 71, (this.HEIGHT/10) * 3), new app.Vector(boxWidth, boxHeight));
		this.buttons["p2ColorLeft"].draw(ctx, app.mouse);
		this.buttons["p2ColorRight"].draw(ctx, app.mouse);
		ctx.save();
		ctx.textAlign = "center";
		this.DrawLib.drawText(ctx, "COLOR", "22pt Play", "white",  new app.Vector(this.WIDTH - (this.WIDTH/5) - 20, this.HEIGHT - (this.HEIGHT/3) + 28));
		ctx.restore();
		
		ctx.save();
		ctx.textAlign = "center";
		this.DrawLib.drawText(ctx, "Player 2", "26pt Play", "white",  new app.Vector(this.WIDTH - (this.WIDTH/5) - 20, this.HEIGHT - (this.HEIGHT/3) - 170));
		ctx.restore();
		
		// Draw the ships
		var player1 = this.cyberFighters.player1;
		var player2 = this.cyberFighters.player2;
		var ship1Pos = new app.Vector((this.WIDTH/12) + 10 + (boxWidth/2) - (player1.size.x/2), this.HEIGHT/2 - 15);
		var ship2Pos = new app.Vector(((this.WIDTH/12) * 7) + 71 + (boxWidth/2) - (player2.size.x/2), this.HEIGHT/2 - 15);
		
		this.DrawLib.drawImage(ctx, player1.image, player1.sourcePosition , player1.sourceSize, ship1Pos, player1.size, 90);
		this.DrawLib.drawImage(ctx, player2.image, player2.sourcePosition, player2.sourceSize, ship2Pos, player2.size, 90);
	},
	
	drawGameInterface: function(ctx, interfaceColor, infoColor)
	{
	// Draws the "ui"
		var interfacePos = new app.Vector(0, this.HEIGHT - (this.HEIGHT/5)); 
		var interfaceSize = new app.Vector(this.WIDTH, (this.HEIGHT/5));

		var padding = 125;
		
		
		var infoBoxSize =  new app.Vector(225, 75);
		var p1InfoBoxPos =  new app.Vector(padding, interfacePos.y + ((interfaceSize.y/2) - (infoBoxSize.y/2)));
		var p2InfoBoxPos =  new app.Vector(this.WIDTH - infoBoxSize.x - padding, interfacePos.y + ((interfaceSize.y/2) - (infoBoxSize.y/2)));

		
		// Draw the interface box
		this.DrawLib.drawBackground(ctx, interfaceColor, interfacePos, interfaceSize);
		// Draw the player 1 info box
		this.DrawLib.drawBackground(ctx, infoColor, p1InfoBoxPos, infoBoxSize);
		// Draw the player 2 info box
		this.DrawLib.drawBackground(ctx, infoColor, p2InfoBoxPos, infoBoxSize);
		
		
		//Draw health and lives text
		var healthPadding = 10;
		var healthHeight =  p1InfoBoxPos.y + (infoBoxSize.y/2);
		
		//drawText(ctx, string, font, fillColor, position)
		this.DrawLib.drawText(ctx, "Health:", "16pt Play", "white", new app.Vector(p1InfoBoxPos.x + healthPadding* 2, healthHeight- healthPadding));
		this.DrawLib.drawText(ctx, "Health:", "16pt Play", "white", new app.Vector(p2InfoBoxPos.x + healthPadding* 2, healthHeight- healthPadding));
		
		this.DrawLib.drawText(ctx, "Lives: ", "16pt Play", "white", new app.Vector(p1InfoBoxPos.x + healthPadding* 2, healthHeight+ healthPadding*2));
		this.DrawLib.drawText(ctx, "Lives: ", "16pt Play", "white", new app.Vector(p2InfoBoxPos.x + healthPadding* 2, healthHeight+ healthPadding*2));
		this.DrawLib.drawText(ctx, this.player1.lives + 1, "16pt Play", "white", new app.Vector(p1InfoBoxPos.x + (healthPadding* 10) + 50, healthHeight+ healthPadding*2));
		this.DrawLib.drawText(ctx, this.player2.lives + 1, "16pt Play", "white", new app.Vector(p2InfoBoxPos.x + (healthPadding* 10) + 50, healthHeight+ healthPadding*2));
		
		// Draws player 1 health to the screen
		for(var i=0; i < this.player1.health; i++) {
			this.DrawLib.drawRect(ctx, this.player1.color, new app.Vector(p1InfoBoxPos.x + (infoBoxSize.x/2) + healthPadding*(i+1), healthHeight- healthPadding/2), new app.Vector(healthPadding, 20), 0);
		}
		// Draws player 2 health to the screen
		for(var i=0; i < this.player2.health; i++) {
			this.DrawLib.drawRect(ctx, this.player2.color, new app.Vector(p2InfoBoxPos.x + (infoBoxSize.x/2) + healthPadding*(i+1), healthHeight- healthPadding/2), new app.Vector(healthPadding, 20), 0);
		}
		
		//draw the ship images
		var shipSize = new app.Vector(50,50);
		var shipBackgroundSize = new app.Vector(60,75);
		var ship1Pos = new app.Vector(p1InfoBoxPos.x - 50, p1InfoBoxPos.y + 10);
		var ship2Pos = new app.Vector(p2InfoBoxPos.x - 50, p1InfoBoxPos.y + 10);
		
		this.DrawLib.drawBackground(ctx, infoColor, new app.Vector(ship1Pos.x-10,ship1Pos.y - shipBackgroundSize.y/8 -0.5), shipBackgroundSize);
		this.DrawLib.drawBackground(ctx, infoColor, new app.Vector(ship2Pos.x-10,ship2Pos.y - shipBackgroundSize.y/8 -0.5), shipBackgroundSize);
		
		this.DrawLib.drawImage(ctx, this.player1.image, this.player1.sourcePosition , this.player1.sourceSize, ship1Pos, shipSize, 90);
		this.DrawLib.drawImage(ctx, this.player2.image, this.player2.sourcePosition, this.player2.sourceSize, ship2Pos, shipSize, 90);
	},
	
		//Test to see if a certain button is clicked or not
	/* Adapted from Friendly Fire */
	buttonClicked : function(buttonTitle)
	{
		return this.buttons[buttonTitle].isClicked();
	}
}