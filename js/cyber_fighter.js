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

app.cyber_fighter = {
	// CONSTANT properties
    WIDTH : 1000, 
    HEIGHT: 600,
	SHIP_WIDTH: 52,
	SHIP_HEIGHT: 52,
	
	//properties
    canvas: undefined,
    ctx: undefined,
    ship: undefined,
	drawLib: undefined,
	dt: 1/60.0, 
	app: undefined,
	utils: undefined,
	emitter: undefined,
	player1: undefined,
	player2: undefined,
	gameState: undefined,
	currentState: undefined,
	thisFrame:0,
	lastFrame:0,
	buttonClickDelay: 0,
	
	p1ColorIndex: 0,
	p2ColorIndex: 4,
	
	buttons: undefined,
	
	escapePressed: undefined,
	// Sounds
	theme: undefined,
	laser: undefined,
	hit: undefined,
	
    
    // methods
	init : function() {
			console.log("app.cyber_fighter.init called");
			// declare properties
			this.canvas = document.querySelector('canvas');
			this.canvas.width = this.WIDTH;
			this.canvas.height = this.HEIGHT;
			this.ctx = this.canvas.getContext('2d');
			
			this.gameState = {
				mainMenu: 0,
				play: 1,
				custom: 2,
				gameOver: 3,
				credit: 4,
				pause: 5,
				controls: 6
			}
			
			this.currentState = this.gameState.custom;
			
			this.colorArray = ["red", "orange", "yellow", "green", "blue", "purple"];
			//this.p1ColorIndex = 0;
			//this.p2ColorIndex = 4;
			
			
			
			this.buttons = {
				//button(text, font, fontColor, image,x,y,width,height) 
				"menuPlayButton" : new app.button("FIGHT", "24pt Play", "white", undefined, this.WIDTH/2, this.HEIGHT/2, 175, 50), 
				"menuCustomButton" : new app.button("CUSTOMIZE", "22pt Play", "white", undefined, this.WIDTH/2, this.HEIGHT/2 + 75, 175, 50),
				"menuCreditButton" : new app.button("CREDITS", "24pt Play", "white", undefined, this.WIDTH/2, this.HEIGHT/2 + 150, 175, 50),
				"overMenuButton" : new app.button("MENU", "24pt Play", "white", undefined, this.WIDTH/2, (this.HEIGHT /2) + 130, 175, 50),
				"overPlayButton" : new app.button("REMATCH", "24pt Play", "white", undefined, this.WIDTH/2, (this.HEIGHT /2) + 60, 175, 50),
				"creditMenuButton" : new app.button("MENU", "24pt Play", "white", undefined, this.WIDTH/9 + 10, this.HEIGHT/10, 175, 50),
				"customMenuButton" : new app.button("MENU", "24pt Play", "white", undefined, this.WIDTH/9 + 10, this.HEIGHT/10, 175, 50),
				"pausePlayButton" : new app.button("RESUME", "24pt Play", "white", undefined, this.WIDTH/2, (this.HEIGHT /2) - 35, 175, 50), 
				"pauseMenuButton" : new app.button("QUIT", "24pt Play", "white", undefined, this.WIDTH/2, (this.HEIGHT /2) + 35, 175, 50),
				"controlPlayButton" : new app.button("CONTINUE", "24pt Play", "white", undefined, this.WIDTH/2, this.HEIGHT -(this.HEIGHT /9) + 5, 175, 50),
				"p1ColorLeft" : new app.button("<<", "24pt Play", "white", undefined, ((this.WIDTH/16) * 1) + 66, ((this.HEIGHT/8) * 5) + 43, 50, 50),
				"p1ColorRight" : new app.button(">>", "24pt Play", "white", undefined, ((this.WIDTH/16) * 4) + 60, ((this.HEIGHT/8) * 5) + 43, 50, 50),
				"p2ColorLeft" : new app.button("<<", "24pt Play", "white", undefined, ((this.WIDTH/16) * 12) - 60, ((this.HEIGHT/8) * 5) + 43, 50, 50),
				"p2ColorRight" : new app.button(">>", "24pt Play", "white", undefined, ((this.WIDTH/16) * 15) -  68, ((this.HEIGHT/8) * 5) + 43, 50, 50),
				
			}
			
			/* Player 1 ship */
			// Create and IMG object
			var image = new Image();
			
			// Get the ship PNG
			image.src = this.app.IMAGES['design1'];
			
			//create the ship
			this.player1 = new app.ship(image,this.WIDTH/4, this.HEIGHT/2.5, this.SHIP_WIDTH, this.SHIP_HEIGHT, 90, this.colorArray[this.p1ColorIndex])
			
			/* Player 2 ship */
			var image = new Image();
			
			// Get the ship PNG
			image.src = this.app.IMAGES['design1'];
			
			//create the ship
			this.player2 = new app.ship(image,3*this.WIDTH/4, this.HEIGHT/2.5, this.SHIP_WIDTH, this.SHIP_HEIGHT, -90, this.colorArray[this.p2ColorIndex])

			//bool to control escape key input
			this.escapePressed = false;
			
			this.update();
			
			this.themeMusic = new Audio('audio/theme1.mp3');
			this.themeMusic.loop = true;
			this.themeMusic.play();
			
			this.laserSound = new Audio('audio/laser.mp3');
			this.hitSound = new Audio('audio/hit.mp3');
			
	},
	
	update: function() {
		//this.drawLib.clear(this.ctx, 0, 0, this.WIDTH, this.HEIGHT);
		// Loop
		requestAnimationFrame(this.update.bind(this));
		
		/* DT update code Taken from Friendly Fire by Alex Fuerst, Mario Chuman, David Erbelding, Brian Nugent, Ryan Farrell for Game Design and Development 2 */
		this.thisFrame = Date.now();
		this.dt = (this.thisFrame - this.lastFrame)/1000;
		this.lastFrame = Date.now();
		
		//handle input
		this.handleKeyboard();
		
		//check for button clicking and switch state accordingly
		if(this.currentState == this.gameState.mainMenu)
		{
			this.buttonClickDelay += this.dt;
			
			if(this.buttonClickDelay >= 0.5)
			{
				if (this.buttonClicked("menuPlayButton")) 
				{
					this.currentState = this.gameState.control;
					this.player1.reset();
					this.player2.reset();
					this.buttons["menuPlayButton"].clickResolution();
					this.buttonClickDelay = 0;
				}
				if (this.buttonClicked("menuCustomButton")) 
				{
					this.currentState = this.gameState.custom;
					this.buttons["menuCustomButton"].clickResolution();
					this.buttonClickDelay = 0;
				}
				if (this.buttonClicked("menuCreditButton")) 
				{
					this.currentState = this.gameState.custom;
					this.buttons["menuCreditButton"].clickResolution();
					this.buttonClickDelay = 0;
				}
			}
		}
		if(this.currentState == this.gameState.credit)
		{
			this.buttonClickDelay += this.dt;
			
			if(this.buttonClickDelay >= 0.5)
			{
				if (this.buttonClicked("creditMenuButton")) {
					this.currentState = this.gameState.mainMenu;
					this.buttons["creditMenuButton"].clickResolution();
					this.buttonClickDelay = 0;
				}
			}
		}
		if(this.currentState == this.gameState.custom)
		{
			this.buttonClickDelay += this.dt;
			
			if(this.buttonClickDelay >= 0.5)
			{
				if (this.buttonClicked("customMenuButton")) {
					this.currentState = this.gameState.mainMenu;
					this.buttons["customMenuButton"].clickResolution();
					this.buttonClickDelay = 0;
				}
				
				//WORKING AREA				
				if(this.buttonClicked("p1ColorLeft")) {
					this.p1ColorIndex--;
					if(this.p1ColorIndex == -1) {
						this.p1ColorIndex = 5;
					}
					this.player1.setColor(this.colorArray[this.p1ColorIndex%6]);
					this.buttons["p1ColorLeft"].clickResolution();
					this.buttonClickDelay = 0;
				}
				
				if(this.buttonClicked("p1ColorRight")) {
					this.p1ColorIndex++;
					if(this.p1ColorIndex == 6) {
						this.p1ColorIndex = 0;
					}
					this.player1.setColor(this.colorArray[this.p1ColorIndex%6]);
					this.buttons["p1ColorRight"].clickResolution();
					this.buttonClickDelay = 0;
				}
				
				if(this.buttonClicked("p2ColorLeft")) {
					this.p2ColorIndex--;
					if(this.p2ColorIndex == -1) {
						this.p2ColorIndex = 5;
					}
					this.player2.setColor(this.colorArray[this.p2ColorIndex%6]);
					this.buttons["p2ColorLeft"].clickResolution();
					this.buttonClickDelay = 0;
				}
				
				if(this.buttonClicked("p2ColorRight")) {
					this.p2ColorIndex++;
					if(this.p2ColorIndex == 6) {
						this.p2ColorIndex = 0;
					}
					this.player2.setColor(this.colorArray[this.p2ColorIndex%6]);
					this.buttons["p2ColorRight"].clickResolution();
					this.buttonClickDelay = 0;
				}
			}
		}
		if(this.currentState == this.gameState.gameOver)
		{
			this.buttonClickDelay += this.dt;
			
			if(this.buttonClickDelay >= 0.5)
			{
				if (this.buttonClicked("overPlayButton")) {
					
					this.currentState = this.gameState.play;
					this.player1.reset();
					this.player2.reset();
					
					this.buttons["overPlayButton"].clickResolution();
					
					this.buttonClickDelay = 0;
					
				}
				if (this.buttonClicked("overMenuButton")) {
					this.currentState = this.gameState.mainMenu;
					this.buttons["overMenuButton"].clickResolution();
					this.buttonClickDelay = 0;
				}
			}
		}
		if(this.currentState == this.gameState.pause)
		{
			this.buttonClickDelay += this.dt;
			
			if(this.buttonClickDelay >= 0.5)
			{
				if (this.buttonClicked("pausePlayButton")) {
					
					this.currentState = this.gameState.play;
					this.buttons["pausePlayButton"].clickResolution();
					this.buttonClickDelay = 0;
					
				}
				if (this.buttonClicked("pauseMenuButton")) {
					this.currentState = this.gameState.mainMenu;
					this.buttons["pauseMenuButton"].clickResolution();
					this.buttonClickDelay = 0;
				}
			}
		}
		if(this.currentState == this.gameState.control)
		{
			this.buttonClickDelay += this.dt;
			
			if(this.buttonClickDelay >= 0.5)
			{
				if (this.buttonClicked("controlPlayButton")) {
					
					this.currentState = this.gameState.play;
					this.buttons["controlPlayButton"].clickResolution();
					this.buttonClickDelay = 0;
				}
			}
		}
		if(this.currentState == this.gameState.play)
		{	
			// Update
			//this.moveSprites();
			this.player1.update(this.dt);
			this.player2.update(this.dt);
			
			// Check for collisions
			this.checkForCollisions();
			
			// Draw
			this.drawGame();
			
			//check for player death
			if(this.player1.isDead == true || this.player2.isDead == true)
			{
				console.log("GameOver");
				this.currentState = this.gameState.gameOver;
			}
		}
		else
		{
			this.drawMenu();
		}
		
	},
	
	//
	drawGame: function() {
		//drawGridBackground(ctx, p1Color, p2Color, position, size)
		this.drawLib.drawGridBackground(this.ctx, new app.vector(0, 0), new app.vector(this.WIDTH, (4*this.HEIGHT/5)));
		//this.drawLib.drawGridBackground(this.ctx, "green", "red", new app.vector(0, 0), new app.vector(this.WIDTH, this.HEIGHT));

		// Draw the sprites
		this.player1.draw(this.dt, this.ctx);
		this.player2.draw(this.dt, this.ctx);
		
		//drawInterface(ctx, interfaceColor, infoColor)
		this.drawGameInterface(this.ctx, "#1F1F1F", "black");
	},
	
	// menu drawing code
	drawMenu: function()
	{
		//drawGridBackground(ctx, p1Color, p2Color, position, size)
		this.drawLib.drawGridBackground(this.ctx, new app.vector(0, 0), new app.vector(this.WIDTH, this.HEIGHT));
		switch(this.currentState) {
			case(this.gameState.mainMenu):
				//drawBackground(ctx, color, position, size) 
				var backgroundHeightPadding = 50;
				this.drawLib.drawBackgroundWithStroke(this.ctx, "black", "#008888", new app.vector(this.WIDTH/3, backgroundHeightPadding/2), new app.vector(this.WIDTH/3, this.HEIGHT - backgroundHeightPadding) );
				this.buttons["menuPlayButton"].draw(this.ctx, app.mouse);
				this.buttons["menuCustomButton"].draw(this.ctx, app.mouse);
				this.buttons["menuCreditButton"].draw(this.ctx, app.mouse);
				break;
			case(this.gameState.custom): //customization screen
				var boxWidth = this.WIDTH/4;
				var boxHeight = this.HEIGHT/2;
			
				this.buttons["customMenuButton"].draw(this.ctx, app.mouse);
				
				this.drawLib.drawBackgroundWithStroke(this.ctx, "black", "#008888", new app.vector((this.WIDTH/12) + 10, (this.HEIGHT/10) * 3), new app.vector(boxWidth, boxHeight));
				this.buttons["p1ColorLeft"].draw(this.ctx, app.mouse);
				this.buttons["p1ColorRight"].draw(this.ctx, app.mouse);
				this.ctx.save();
				this.ctx.textAlign = "center";
				this.drawLib.drawText(this.ctx, "COLOR", "22pt Play", "white",  new app.vector((this.WIDTH/5) + 20, this.HEIGHT - (this.HEIGHT/3) + 28));
				this.ctx.restore();
				
				this.ctx.save();
				this.ctx.textAlign = "center";
				this.drawLib.drawText(this.ctx, "Player 1", "26pt Play", "white",  new app.vector((this.WIDTH/5) + 20, this.HEIGHT - (this.HEIGHT/3) - 170));
				this.ctx.restore();
				
				
				this.drawLib.drawBackgroundWithStroke(this.ctx, "black", "#008888", new app.vector((this.WIDTH/12) * 7 + 71, (this.HEIGHT/10) * 3), new app.vector(boxWidth, boxHeight));
				this.buttons["p2ColorLeft"].draw(this.ctx, app.mouse);
				this.buttons["p2ColorRight"].draw(this.ctx, app.mouse);
				this.ctx.save();
				this.ctx.textAlign = "center";
				this.drawLib.drawText(this.ctx, "COLOR", "22pt Play", "white",  new app.vector(this.WIDTH - (this.WIDTH/5) - 20, this.HEIGHT - (this.HEIGHT/3) + 28));
				this.ctx.restore();
				
				this.ctx.save();
				this.ctx.textAlign = "center";
				this.drawLib.drawText(this.ctx, "Player 2", "26pt Play", "white",  new app.vector(this.WIDTH - (this.WIDTH/5) - 20, this.HEIGHT - (this.HEIGHT/3) - 170));
				this.ctx.restore();
				
				// Draw the ships
				var ship1Pos = new app.vector((this.WIDTH/12) + 10 + (boxWidth/2) - (this.player1.size.x/2), this.HEIGHT/2 - 15);
				var ship2Pos = new app.vector(((this.WIDTH/12) * 7) + 71 + (boxWidth/2) - (this.player2.size.x/2), this.HEIGHT/2 - 15);
				
				this.drawLib.drawImage(this.ctx, this.player1.image, this.player1.sourcePosition , this.player1.sourceSize, ship1Pos, this.player1.size, 90);
				this.drawLib.drawImage(this.ctx, this.player2.image, this.player2.sourcePosition, this.player2.sourceSize, ship2Pos, this.player2.size, 90);

				
				
				
				break;
			case(this.gameState.pause): //pause screen
				this.drawGame();
				this.buttons["pauseMenuButton"].draw(this.ctx, app.mouse);
				this.buttons["pausePlayButton"].draw(this.ctx, app.mouse);
				break;
			case(this.gameState.control): //controls screen
			
				this.buttons["controlPlayButton"].draw(this.ctx, app.mouse);
				break;
			case(this.gameState.gameOver)://gameover screen
				//drawText(ctx, string, font, fillColor, position)
				this.ctx.save();
				
				var backgroundHeightPadding = 150;
				this.drawLib.drawBackgroundWithStroke(this.ctx, "black", "#008888", new app.vector(this.WIDTH/10, backgroundHeightPadding/2), new app.vector(4*this.WIDTH/5, this.HEIGHT - backgroundHeightPadding) );
				
				this.ctx.textAlign = "center";
				
				var textPad = 50;
				
				this.drawLib.drawText(this.ctx, "GAME OVER", "40pt Play", "#008888",  new app.vector(this.WIDTH/2, this.HEIGHT/4 + textPad));
				if(this.player2.isDead) {
					this.drawLib.drawText(this.ctx, "Player One Wins!", "40pt Play", this.selectedP1Color,  new app.vector(this.WIDTH/2, 2*(this.HEIGHT/5) + textPad));
				}
				if(this.player1.isDead) {
					this.drawLib.drawText(this.ctx, "Player Two Wins!", "40pt Play", this.selectedP2Color,  new app.vector(this.WIDTH/2, 2*(this.HEIGHT/5) + textPad));
				}
				if(this.player1.isDead && this.player2.isDead) {
					this.drawLib.drawText(this.ctx, "Draw", "40pt Play", "#008888",  new app.vector(this.WIDTH/2, 2*(this.HEIGHT/4)));
				}
				this.buttons["overPlayButton"].draw(this.ctx, app.mouse);
				this.buttons["overMenuButton"].draw(this.ctx, app.mouse);
				this.ctx.restore();
				break;
		}
	},
	
	checkForCollisions: function() {
		var self = this;
		
		//Player 1 vs Player 2 bullets
		if(this.player1.isActive == true)
		{
			self.player2.bullets.forEach(function(bullet)
			{
				if(self.collides(bullet, self.player1))
				{
					//collision stuff
					console.log("Player 1 shot");
					bullet.active = false;
					self.player1.bulletHit();
					self.hitSound.play();
				}
			});
		}
		
		//Player 2 vs Player 1 bullets
		if(this.player2.isActive == true)
		{
			self.player1.bullets.forEach(function(bullet)
			{
				if(self.collides(bullet, self.player2))
				{
					//collision stuff
					console.log("Player 2 shot");
					bullet.active = false;
					self.player2.bulletHit();
					self.hitSound.play();
				}
			
			});
		}
	},
	
	collides: function(a,b) {
		//a = sprite 1, b = sprite 2
		var ax = a.position.x - a.size.x/2;
		var ay = a.position.y - a.size.y/2;
		var bx = b.position.x - b.size.x/2;
		var by = b.position.y - b.size.y/2;
		
		return ax < bx + b.size.x && ax + a.size.x > bx && ay < by + b.size.y && ay + a.size.y > by;
	},
	
	
	handleKeyboard: function()
	{
		if(this.currentState == this.gameState.play)
		{
			if(this.escapePressed == false)
			{
				if(this.app.keydown[this.app.KEYBOARD.KEY_ESC])
				{
					this.currentState = this.gameState.pause;
					console.log(this.currentState);
					this.escapePressed = true;
				}
			}
			else
			{
				if(!this.app.keydown[this.app.KEYBOARD.KEY_ESC])
				{
					this.escapePressed = false;
				}
			}
		
			//Player 1 input
			if(this.app.keydown[this.app.KEYBOARD.KEY_A])
			{
				this.player1.rotate("left", this.dt);
			}
			if(this.app.keydown[this.app.KEYBOARD.KEY_D])
			{
				this.player1.rotate("right", this.dt);
			}
			if(this.app.keydown[this.app.KEYBOARD.KEY_W] == true)
			{
				this.player1.isAccelerating = true;
			}
			else if(this.app.keydown[this.app.KEYBOARD.KEY_W] == false)
			{
				this.player1.isAccelerating = false;
			}
			if(this.app.keydown[this.app.KEYBOARD.KEY_E])
			{
				this.player1.shoot();
				this.laserSound.play();
			}
			
			//Player 2 input
			if(this.app.keydown[this.app.KEYBOARD.KEY_J])
			{
				this.player2.rotate("left", this.dt);
			}
			if(this.app.keydown[this.app.KEYBOARD.KEY_L])
			{
				this.player2.rotate("right", this.dt);
			}
			if(this.app.keydown[this.app.KEYBOARD.KEY_I] == true)
			{
				this.player2.isAccelerating = true;
			}
			else if(this.app.keydown[this.app.KEYBOARD.KEY_I] == false)
			{
				this.player2.isAccelerating = false;
			}
			if(this.app.keydown[this.app.KEYBOARD.KEY_U])
			{
				this.player2.shoot();
				this.laserSound.play();
			}
		}
		
		if(this.currentState == this.gameState.pause)
		{
			console.log(this.escapePressed);
			if(this.escapePressed == false)
			{
				if(this.app.keydown[this.app.KEYBOARD.KEY_ESC] == true)
				{
					this.currentState = this.gameState.play;
					console.log(this.currentState);
					this.escapePressed = true;
				}
			}
			else
			{
				if(this.app.keydown[this.app.KEYBOARD.KEY_ESC] == false)
				{
					this.escapePressed = false;
				}
			}
		}
	},
	
	//draw the interface for the game
	drawGameInterface: function(ctx, interfaceColor, infoColor) {
		// Draws the "ui"
		var interfacePos = new app.vector(0, this.HEIGHT - (this.HEIGHT/5)); 
		var interfaceSize = new app.vector(this.WIDTH, (this.HEIGHT/5));

		var padding = 125;
		
		
		var infoBoxSize =  new app.vector(225, 75);
		var p1InfoBoxPos =  new app.vector(padding, interfacePos.y + ((interfaceSize.y/2) - (infoBoxSize.y/2)));
		var p2InfoBoxPos =  new app.vector(this.WIDTH - infoBoxSize.x - padding, interfacePos.y + ((interfaceSize.y/2) - (infoBoxSize.y/2)));

		
		// Draw the interface box
		this.drawLib.drawBackground(ctx, interfaceColor, interfacePos, interfaceSize);
		// Draw the player 1 info box
		this.drawLib.drawBackground(ctx, infoColor, p1InfoBoxPos, infoBoxSize);
		// Draw the player 2 info box
		this.drawLib.drawBackground(ctx, infoColor, p2InfoBoxPos, infoBoxSize);
		
		
		//Draw health and lives text
		var healthPadding = 10;
		var healthHeight =  p1InfoBoxPos.y + (infoBoxSize.y/2);
		
		//drawText(ctx, string, font, fillColor, position)
		this.drawLib.drawText(ctx, "Health:", "16pt Play", "white", new app.vector(p1InfoBoxPos.x + healthPadding* 2, healthHeight- healthPadding));
		this.drawLib.drawText(ctx, "Health:", "16pt Play", "white", new app.vector(p2InfoBoxPos.x + healthPadding* 2, healthHeight- healthPadding));
		
		this.drawLib.drawText(ctx, "Lives: ", "16pt Play", "white", new app.vector(p1InfoBoxPos.x + healthPadding* 2, healthHeight+ healthPadding*2));
		this.drawLib.drawText(ctx, "Lives: ", "16pt Play", "white", new app.vector(p2InfoBoxPos.x + healthPadding* 2, healthHeight+ healthPadding*2));
		this.drawLib.drawText(ctx, this.player1.lives + 1, "16pt Play", "white", new app.vector(p1InfoBoxPos.x + (healthPadding* 10) + 50, healthHeight+ healthPadding*2));
		this.drawLib.drawText(ctx, this.player2.lives + 1, "16pt Play", "white", new app.vector(p2InfoBoxPos.x + (healthPadding* 10) + 50, healthHeight+ healthPadding*2));
		
		// Draws player 1 health to the screen
		for(var i=0; i < this.player1.health; i++) {
			this.drawLib.drawRect(ctx, this.player1.color, new app.vector(p1InfoBoxPos.x + (infoBoxSize.x/2) + healthPadding*(i+1), healthHeight- healthPadding/2), new app.vector(healthPadding, 20), 0);
		}
		// Draws player 2 health to the screen
		for(var i=0; i < this.player2.health; i++) {
			this.drawLib.drawRect(ctx, this.player2.color, new app.vector(p2InfoBoxPos.x + (infoBoxSize.x/2) + healthPadding*(i+1), healthHeight- healthPadding/2), new app.vector(healthPadding, 20), 0);
		}
		
		//draw the ship images
		var shipSize = new app.vector(50,50);
		var shipBackgroundSize = new app.vector(60,75);
		var ship1Pos = new app.vector(p1InfoBoxPos.x - 50, p1InfoBoxPos.y + 10);
		var ship2Pos = new app.vector(p2InfoBoxPos.x - 50, p1InfoBoxPos.y + 10);
		
		this.drawLib.drawBackground(ctx, infoColor, new app.vector(ship1Pos.x-10,ship1Pos.y - shipBackgroundSize.y/8 -0.5), shipBackgroundSize);
		this.drawLib.drawBackground(ctx, infoColor, new app.vector(ship2Pos.x-10,ship2Pos.y - shipBackgroundSize.y/8 -0.5), shipBackgroundSize);
		
		this.drawLib.drawImage(ctx, this.player1.image, this.player1.sourcePosition , this.player1.sourceSize, ship1Pos, shipSize, 90);
		this.drawLib.drawImage(ctx, this.player2.image, this.player2.sourcePosition, this.player2.sourceSize, ship2Pos, shipSize, 90);
	},
	
	//Test to see if a certain button is clicked or not
	/* Adapted from Friendly Fire */
	buttonClicked : function(buttonTitle)
	{
		return this.buttons[buttonTitle].isClicked();
	}
}
