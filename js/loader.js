/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

//CONSTANTS
app.KEYBOARD = {
	"KEY_LEFT": 37,
	"KEY_UP": 38,
	"KEY_RIGHT": 39,
	"KEY_DOWN": 40,
	"KEY_CTRL": 17,
	"KEY_W": 87,
	"KEY_A": 65,
	"KEY_S": 83,
	"KEY_D": 68,
	"KEY_F": 70
};

app.IMAGES = 
{
	shipImage: "images/Hunter1.png",
	//enemyImage: "images/Drone1.png"
	};

//app.keydown array to keep track of which keys are down
//this is called a "key daemon"
//cyber_fighter.js will "poll" this array every frame
//this works because js has "sparse arrays" - not every language does
app.keydown = [];

window.onload = function(){
	console.log("window.onload called");
	app.cyber_fighter.app = app;
	app.cyber_fighter.drawLib = app.drawLib;
	app.ship.drawLib = app.drawLib;
	app.cyber_fighter.utils = app.utils;
	
	window.addEventListener("keydown",function(e)
	{
		//console.log("keydown=" e.keyCode);
		app.keydown[e.keyCode] = true;
	});
	window.addEventListener("keyup",function(e)
	{
		//console.log("keydown=" e.keyCode);
		app.keydown[e.keyCode] = false;
	});
	
	//preload images and sound
	app.queue = new createjs.LoadQueue(false);
	app.queue.installPlugin(createjs.Sound);
	app.queue.on("complete", function()
	{
		console.log("images loaded called");
		app.cyber_fighter.init(app.ship);
	});
	
	//load the image files
	app.queue.loadManifest(
	[
		{id: "shipImage", src:"images/Hunter1.png"},
		//{id: "enemyImage", src:"images/Drone1.png"},
	]);
}