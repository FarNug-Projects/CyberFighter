/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// If app exists use the existing copy, otherwise create a new object literal.
var app = app || {};

//CONSTANTS
app.KEYBOARD = {
	"KEY_ESC": 27,

	"KEY_LEFT": 37,
	"KEY_UP": 38,
	"KEY_RIGHT": 39,
	"KEY_DOWN": 40,
	"KEY_CTRL": 17,
	
	"KEY_J": 74,
	"KEY_I": 73,
	"KEY_L": 76,
	"KEY_K": 75,
	"KEY_H": 72,
	"KEY_U": 85,
	
	"KEY_W": 87,
	"KEY_A": 65,
	"KEY_S": 83,
	"KEY_D": 68,
	"KEY_E": 69
};

// Loading images.
app.IMAGES = 
{
	fighter: "images/fighter.png",
	instructions: "images/instructions.png",
};

//app.keydown array to keep track of which keys are down
//this is called a "key daemon"
//cyber_fighter.js will "poll" this array every frame
//this works because js has "sparse arrays" - not every language does
app.keydown = [];

app.mouse = 
{
	x:0,
	y:0,
	clicked:false,
};

window.onload = function(){
	app.Cyber_Fighter.app = app;
	app.Cyber_Fighter.DrawLib = app.DrawLib;
	app.Cyber_Fighter.Interface = app.Interface;
	app.Interface.DrawLib = app.DrawLib;
	app.Ship.prototype.app = app;
	app.Cyber_Fighter.utils = app.utils;
	
	window.addEventListener("keydown",function(e)
	{
		app.keydown[e.keyCode] = true;
	});
	window.addEventListener("keyup",function(e)
	{
		app.keydown[e.keyCode] = false;
	});
	
	//Mouse events
	window.addEventListener("mousemove", function(e){
        app.mouse.x = e.pageX - e.target.offsetLeft;
        app.mouse.y = e.pageY - e.target.offsetTop;
	});
	
	window.addEventListener("mousedown", function(e){app.mouse.clicked = true;});
	window.addEventListener("mouseup", function(e){app.mouse.clicked = false;});
	
	//Preloads images and sounds
	app.queue = new createjs.LoadQueue(false);
	app.queue.installPlugin(createjs.Sound);
	app.queue.on("complete", function()
	{
		app.Cyber_Fighter.init(app.Ship);
		app.DrawLib.init(app.Cyber_Fighter);
	});
	
	// Loads the image files
	app.queue.loadManifest(
	[
		{id: "fighter", src:"images/fighter.png"},
		{id: "instructions", src: "images/instructions.png"},
	]);
}