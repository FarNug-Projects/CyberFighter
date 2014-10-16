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
app.button = function()
{

	//Button constructor
	function button(text, font, fontColor, image,x,y,width,height) 
	{
		// Instance variables of Button
		/*this.x = x;
		this.y = y;*/
		this.position = new app.vector(x, y);
		this.size = new app.vector(width, height);
		this.scale = 1;
		
		//store the text to be drawn on the button
		this.text = text;
		this.font = font;
		this.fontColor = fontColor;
		
		//set the image and default "backup" color
		this.image = image;
		this.color = "red";
		this.clicked = false;
		
	};//constructor
		
	// Prototype for making functions/methods available outside of the class
	var p = button.prototype;
	
	//Button Draw Method
	p.draw = function(ctx,mouse) 
	{
		ctx.save();
		
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
		}//if image
		
		ctx.restore();
		
		ctx.save();
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		//drawText(ctx, string, font, fillColor, position)
		app.drawLib.drawText(ctx, this.text, this.font, this.fontColor, this.position);
		ctx.restore();
		
		//handle any input
		update(mouse,this);
	};//draw
	
	//accessor/get for clicked state
	p.isClicked = function() {return this.clicked;};
	
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
			
	};//contains mouse
	
	//Button update function
	function update(mouse,that) 
	{
		//handle mouse input
		handleMouse(containsMouse(mouse,that),that,mouse);
	};//update
	  
	//This handles all input to be gathered from the mouse
	//Event handler is in loader.js.  Coordinates are determined in FriendlyFire.js
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
			
	};//hover
	
	return button;
	
}();//end of Button.js
