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

app.Cyber_Fighter = {
	// CONSTANT properties
    WIDTH : 1000, 
    HEIGHT: 600,
	SHIP_WIDTH: 52,
	SHIP_HEIGHT: 52,
	
	//properties
    canvas: undefined,
    ctx: undefined,
    Ship: undefined,
	DrawLib: undefined,
	Interface: undefined,
	dt: 0, 
	app: undefined,
	utils: undefined,
	Emitter: undefined,
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
				pause: 5,
				controls: 6
			}
			
			this.currentState = this.gameState.mainMenu;
			
//			this.colorArray = ["red", "orange", "yellow", "green", "blue", "purple"];
			
			
			this.buttons = {
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
				
			}
			
			//initialize the interface
			this.Interface.init(this);
			
			/* Player 1 ship */
			// Create and IMG object
			var image = new Image();
			
			// Get the ship PNG
			image.src = this.app.IMAGES['design1'];
			
			//create the ship
			this.player1 = new app.Ship(image,this.WIDTH/4, this.HEIGHT/2.5, this.SHIP_WIDTH, this.SHIP_HEIGHT, 90, this.Interface.colorArray[this.Interface.p1ColorIndex])
			
			/* Player 2 ship */
			var image = new Image();
			
			// Get the ship PNG
			image.src = this.app.IMAGES['design1'];
			
			//create the ship
			this.player2 = new app.Ship(image,3*this.WIDTH/4, this.HEIGHT/2.5, this.SHIP_WIDTH, this.SHIP_HEIGHT, -90, this.Interface.colorArray[this.Interface.p2ColorIndex])

			//pass the ships to the interface
			this.Interface.player1= this.player1;
			this.Interface.player2= this.player2;
			
			//bool to control escape key input
			this.escapePressed = false;			
			
			//sound variables
			this.themeMusic = new Audio('audio/theme1.mp3');
			this.themeMusic.loop = true;
			this.themeMusic.volume = 0.2;
			this.themeMusic.play();
			
			this.updateAndDraw();
	},
	
	updateAndDraw: function() {
		//this.DrawLib.clear(this.ctx, 0, 0, this.WIDTH, this.HEIGHT);
		// Loop
		requestAnimationFrame(this.updateAndDraw.bind(this));
		
		//draw the background grid
		this.DrawLib.drawGridBackground(this.ctx, new app.Vector(0, 0), new app.Vector(this.WIDTH, this.HEIGHT));
		
		/* DT update code Taken from Friendly Fire by Alex Fuerst, Mario Chuman, David Erbelding, Brian Nugent, Ryan Farrell for Game Design and Development 2 */
		this.thisFrame = Date.now();
		this.dt = (this.thisFrame - this.lastFrame)/1000;
		this.lastFrame = Date.now();
		
		//handle input
		this.handleKeyboard();
		
		//check for button clicking and switch state accordingly
		switch(this.currentState) {
			case(this.gameState.mainMenu): 
				this.Interface.drawMainMenu(this.ctx);
				this.Interface.updateMainMenu(this.dt);
				break;
			case(this.gameState.custom): //customization screen
				this.Interface.drawCustomMenu(this.ctx);
				this.Interface.updateCustomMenu(this.dt);
				break;
			case(this.gameState.pause): //pause screen
				this.player1.draw(this.dt, this.ctx);
				this.player2.draw(this.dt, this.ctx);
				this.Interface.drawGameInterface(this.ctx, "#1F1F1F", "black");
				this.Interface.drawPause(this.ctx);
				this.Interface.updatePause(this.dt);
				break;
			case(this.gameState.control): //controls screen
				this.Interface.drawControls(this.ctx);
				this.Interface.updateControls(this.dt);
				break;
			case(this.gameState.gameOver)://gameover screen
				this.Interface.drawGameOver(this.ctx);
				this.Interface.updateGameOver(this.dt);
				break;
			case(this.gameState.play)://game screen
				// Update
				this.player1.update(this.dt);
				this.player2.update(this.dt);
				
				// Check for collisions
				this.checkForCollisions();
				
				// Draw
				// Draw the sprites
				this.player1.draw(this.dt, this.ctx);
				this.player2.draw(this.dt, this.ctx);
				
				//drawInterface(ctx, interfaceColor, infoColor)
				this.Interface.drawGameInterface(this.ctx, "#1F1F1F", "black");
				
				//check for player death
				if(this.player1.isDead == true || this.player2.isDead == true)
				{
					this.currentState = this.gameState.gameOver;
				}
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
					bullet.active = false;
					self.player1.bulletHit();
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
					bullet.active = false;
					self.player2.bulletHit();
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
		switch(this.currentState)
		{
			case this.gameState.play:
				if(this.escapePressed == false)
				{
					if(this.app.keydown[this.app.KEYBOARD.KEY_ESC])
					{
						console.log("Escape Pressed");
						this.currentState = this.gameState.pause;

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
				}
				break;
			case this.gameState.pause:
				if(this.escapePressed == false)
				{
					if(this.app.keydown[this.app.KEYBOARD.KEY_ESC] == true)
					{
						this.currentState = this.gameState.play;
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
				break;
		}
	
		/*if(this.currentState == this.gameState.play)
		{
			if(this.escapePressed == false)
			{
				if(this.app.keydown[this.app.KEYBOARD.KEY_ESC])
				{
					console.log("Escape Pressed");
					this.currentState = this.gameState.pause;

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
			}
		}*/
		
		if(this.currentState == this.gameState.pause)
		{
			if(this.escapePressed == false)
			{
				if(this.app.keydown[this.app.KEYBOARD.KEY_ESC] == true)
				{
					this.currentState = this.gameState.play;
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
	
	//Test to see if a certain button is clicked or not
	/* Adapted from Friendly Fire */
	buttonClicked : function(buttonTitle)
	{
		return this.buttons[buttonTitle].isClicked();
	}
}
