/*
	Created originally for:
		Friendly Fire

		Alex Fuerst, 
		Mario Chuman,
		David Erbelding,
		Brian Nugent,
		Ryan Farrell,

		Game Design and Development 2
		10/2/2014

	Adapted for use in:
		cyber_fighter.exe
		
		Brian Nugent,
		Ryan Farrell

		Rich Web Media Development
		10/16/2014
*/
//Button.js is the "class" for our button objects

"use strict";

//Create the global app object if needed
var app = app || {};

// This is the "IIFE"/Class for the Button
app.Button = function()
{

	//Button constructor
	function Button(text, font, fontColor, image,x,y,width,height) 
	{
		// Instance variables of Button
		this.position = new app.Vector(x, y);
		this.size = new app.Vector(width, height);
		this.scale = 1;
		
		//store the text to be drawn on the button
		this.text = text;
		this.font = font;
		this.fontColor = fontColor;
		
		//set the image and default "backup" color
		this.image = image;
		this.color = "#454545";
		this.clicked = false;
		
		//audio
		this.soundHandler = new app.SoundHandler();
		
	};
		
	// Prototype for making functions/methods available outside of the class
	var p = Button.prototype;
	
	//Button Draw Method
	p.draw = function(ctx,mouse) 
	{
		ctx.save();
		
		if(this.clicked)
		{
			this.scale = 1.0;
		}
		
		//drawing origin is top left corner
		//use this to center image on (x,y)
		var halfW = (this.size.x * this.scale)/2;
		var halfH = (this.size.y * this.scale)/2;
		
		//test to see if there is an image and draw accordingly
		if(!this.image){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.position.x - halfW, this.position.y - halfH, this.size.x * this.scale, this.size.y * this.scale);
			
		} else{
			ctx.drawImage(this.image,this.position.x - halfW, this.position.y - halfH, this.size.x * this.scale, this.size.y * this.scale);
		}
		
		ctx.restore();
		
		ctx.save();
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		
		//drawText(ctx, string, font, fillColor, position)
		app.DrawLib.drawText(ctx, this.text, this.font, this.fontColor, this.position);
		
		ctx.restore();
		
		//handle any input
		update(mouse,this);
	};
	
	//accessor/get for clicked state
	p.isClicked = function() {return this.clicked;};
	
	//reset the button's click state
	p.clickResolution = function()
	{
		this.clickedSound.pause(); // change
		this.clickedSound.play(); // change
		this.scale = 1.0;
		this.clicked = false;
	}
	
	// private functions/methods
	
	// This checks to see that the mouse is within the button
	// takes mouse and this as params
	function containsMouse(mouse,that) 
	{
		//was originally having object access issues, this can be cleaned up later
		var mx = mouse.x;
		var my = mouse.y;
		
		//if the mouse coords are within the button return true
		if(mx > that.position.x - that.size.x/2 && mx < that.position.x + that.size.x/2
			&& my > that.position.y - that.size.y/2 && my < that.position.y + that.size.y/2)
			return true;
		else
			return false;
			
	};
	
	//Button update function
	function update(mouse,that) 
	{
		//handle mouse input
		handleMouse(containsMouse(mouse,that),that,mouse);
	};
	  
	//This handles all input to be gathered from the mouse
	function handleMouse(hovering,that,mouse)
	{
		//if hovering enlarge button and set click state to the mouse's click state
		if(hovering)
		{
			that.scale = 1.2;
			that.clicked = mouse.clicked;
		}
		else
		{
			that.scale = 1;
			that.clicked = false;
		}
			
	};
	
	return Button;
}();
