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

app.blastem = {

	//constants
	WIDTH: undefined,
	HEIGHT: undefined,
	
	canvas: undefined,
    ctx: undefined,
	app: undefined,
	gameState : undefined,
	currentState : undefined,
	
	init : function()
	{
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
	}
}