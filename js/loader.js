/*
	cyber_fighter.exe
	
	Brian Nugent,
	Ryan Farrell

	Rich Web Media Development
*/

// loader.js - this loads and initializes all of the needed data 

"use strict";

//create the global application object if it doesn't exist
var app = app || {};

//"hashtable" of keycodes to their actual values
app.KEYBOARD = 
{
	"KEY_ENTER": 13,
	"KEY_LEFT": 37,
	"KEY_UP": 38,
	"KEY_RIGHT": 39,
	"KEY_CONTROL": 17,
	"KEY_W": 87,
	"KEY_A": 65,
	"KEY_D": 68,
	"KEY_P": 80
};

//mouse object with coords and click state
app.mouse = 
{
	x:0,
	y:0,
	clicked:false,
};

//"hashtable" of our images
app.IMAGES = 
{
	teamLogo: "images/logo.png"
	/*
		sword: "images/sword.png"
		axe: "images/axe.png"
		spear: "images/spear.png"
		mace: "images/mace.png"
	*/
};

//array of booleans representing pressed keys
app.keydown = [];

//Run loader.js when the window loads
window.onload = function()
{
	//When a key is pressed set its place in the array to true
	window.addEventListener("keydown", function(e){
		app.keydown[e.keyCode] = true;
	});
	
	//when a key is released set its place in the array to false
	window.addEventListener("keyup", function(e){
		app.keydown[e.keyCode] = false;
		if(e.keyCode == app.KEYBOARD["KEY_P"])
			app.FriendlyFire.pausedPressed = true;
	});
	
	// hook the interface up to the controller
	app.FriendlyFire.userInterface = app.Interface;
	
	//Give the app variable to objects that need to access it
	app.FriendlyFire.app = app;
	app.Player.prototype.app = app;
	
	//preload Images and Sound and then run FriendlyFire.init
	app.queue = new createjs.LoadQueue(false);
	app.queue.installPlugin(createjs.Sound);
	app.queue.on("complete", function()
	{
		app.FriendlyFire.init();
	});
	app.queue.loadManifest([
		{id: "teamLogo", src:"images/logo.png"}
		]);
		
	//Handle the mouses position.  It calls a method in FriendlyFire because
	//FriendlyFire knows about the canvas, therefore, we can get canvas coords, not screen coords
	window.addEventListener("mousemove", function(e){
		var position = app.FriendlyFire.getMousePos(e);
		app.mouse.x = position.x;
		app.mouse.y = position.y;
	});
	
	//Set the mouse's click state
	window.addEventListener("mousedown", function(e){app.mouse.clicked = true;});
	window.addEventListener("mouseup", function(e){app.mouse.clicked = false;});
	
}//end of loader.js