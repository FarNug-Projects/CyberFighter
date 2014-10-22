/*
		cyber_fighter.exe
		
		Brian Nugent,
		Ryan Farrell

		Rich Web Media Development
*/


//SoundHandler.js is the "class" for our sound handling "objects"

"use strict";

//Create the global app object if needed
var app = app || {};

// This is the "IIFE"/Class for the Vector
app.SoundHandler = function()
{
	//constructor for the vector class
	function SoundHandler()
	{
		//button click sound
		this.clickedSound = new Audio('audio/button-09.mp3'); // Source: soundjay.com
		this.clickedSound.volume = 0.5;
		
		//bullet sounds
		this.laserSound = new Audio('audio/laser.mp3');  // Source: soundbible.com
		this.laserSound.volume = 0.2;
		this.soundPlayed = false;
		this.hitSound = new Audio('audio/hit.mp3');  // Source: soundbible.com
		this.hitSound.volume = 0.2;
		
		//ship sounds
		this.reviveSound = new Audio('audio/revive.mp3');  // Source: soundbible.com
		this.engineSound = new Audio('audio/engine.mp3');  // Source: soundbible.com
		this.engineSound.volume = 0.8;
	};
	
	var p = SoundHandler.prototype;
	
	//play button related sound
	p.buttonClickedSoundPlay = function()
	{
		this.clickedSound.play();
	};
	p.buttonClickedSoundPause = function()
	{
		this.clickedSound.pause();
	};
	
	//play bullet firing sound
	p.bulletFiredSoundPlay = function()
	{
		this.laserSound.play();
	}
	//play bullet firing sound
	p.bulletFiredSoundPause = function()
	{
		this.laserSound.pause();
	}
	
	//play bullet hit sound
	p.bulletHitSoundPlay = function()
	{
		this.hitSound.play();
	}
	//pause bullet hit sound
	p.bulletHitSoundPause = function()
	{
		this.hitSound.pause();
	}
	
	//play ship revival sound
	p.shipReviveSoundPlay = function()
	{	
		this.reviveSound.play();
	}
	//pause ship revival sound
	p.shipReviveSoundPause = function()
	{	
		this.reviveSound.pause();
	}
	
	//play ship engine sound
	p.shipEngineSoundPlay = function()
	{	
		this.engineSound.play();
		this.engineSound.loop = true;
	}
	
	//pause ship engine sound
	p.shipEngineSoundPause = function()
	{	
		this.engineSound.pause();
	}
	
	return SoundHandler;
}();