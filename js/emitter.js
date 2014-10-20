"use strict";
var app = app || {};

app.Emitter=function(){

	function Emitter(){
		// public
		this.numParticles = 50;
		this.xRange = 4;
		this.yRange = 4;
		this.minXspeed = -0.001;
		this.maxXspeed = 0.001;
		this.minYspeed = -0.001;
		this.maxYspeed = 0.001;
		this.startRadius = 5;
		this.expansionRate = 0.5;
		this.decayRate = 5;
		this.lifetime = 100;
		this.particles = undefined;
	};
	
	// "public" methods
	var p = Emitter.prototype;
	
	p.createParticles = function(emitterPoint){
		this.particles = [];
		
		// Create exhaust particles
		for(var i=0; i < this.numParticles; i++) {
			// Create a particle object and add to array
			var p = {};
			this.particles.push(initParticle(this, p, emitterPoint));
		}
	};

	// Draws the particles in the array to the screen
	p.draw = function(ctx, color) {
		for( var i = 0; i < this.particles.length; i++) {
			var p = this.particles[i];
			var alpha = 1 - p.age/this.lifetime;
			var red = 0;
			var green = 0;
			var blue = 0;
			
			switch(color) {
				case "purple":
					red = 255;
					green = 0;
					blue = 237;
					break;
				case "yellow":
					red = 250;
					green = 255;
					blue = 0;
					break;
				case "orange":
					red = 255;
					green = 152;
					blue = 0;
					break;
				case "green":
					red = 165;
					green = 255;
					blue = 0;
					break;
				case "blue":
					red = 0;
					green = 231;
					blue = 255;
					break;
				case "red":
					red = 255;
					green = 0;
					blue = 0;
					break;
			}
			
			// Emission is made up of circles
			ctx.strokeStyle = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.r, Math.PI * 2, false);
			ctx.closePath();
			ctx.stroke();
		}
	};
	
	// Updates the particle stream, makes them decay and disappear
	p.update = function(emitterPoint) {
		for(var i=0; i < this.particles.length; i++) {
			var p = this.particles[i];
			p.age += this.decayRate;
			p.r += this.expansionRate;
			p.x += p.xSpeed;
			p.y += p.ySpeed;
			
			
			if(p.age >= this.lifetime) {
				initParticle(this, p, emitterPoint);
			}
		}
	};
			
	// "private" method, particle creator
	function initParticle(obj, p, emitterPoint){
		// give it a random age when first created
		p.age = app.utils.getRandomInt(0,obj.lifetime);
	
		p.x = emitterPoint.x + app.utils.getRandom(-obj.xRange, obj.xRange);
		p.y = emitterPoint.y + app.utils.getRandom(0, obj.yRange);
		p.r = app.utils.getRandom(obj.startRadius/2, obj.startRadius); // radius
		p.xSpeed = app.utils.getRandom(obj.minXspeed, obj.maxXspeed);
		p.ySpeed = app.utils.getRandom(obj.minYspeed, obj.maxYspeed);

		return p;
	};
	
	return Emitter;
}();