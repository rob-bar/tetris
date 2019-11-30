function ScoreMarker(scoreToDeploy, multiplier, posObj, width, color, delay){
	var uID = randomFromTo(0, 999999);
	(scoreToDeploy === undefined)? this.scoreToDeploy = 0 : this.scoreToDeploy = scoreToDeploy;
	(multiplier === undefined)? this.multiplier = 0 : this.multiplier = multiplier;
	(posObj === undefined)? this.posObj = {} : this.posObj = posObj;
	(width === undefined)? this.width = 0 : this.width = width;
	(color === undefined)? this.color = "#000000" : this.color = color;
	(delay === undefined)? this.delay = 0 : this.delay = delay;
	this.generate = function(){
		if(multiplier!=0){
			$('#fallingfield').append('<p id="'+uID+'">+'+scoreToDeploy+'<sup>*'+multiplier+'</sup></p>');
		}else{
			$('#fallingfield').append('<p id="'+uID+'">+'+scoreToDeploy+'</p>');	
		}
		$('#'+uID).css({
			'top' : posObj.y * Game.BLOCKWIDTHHEIGHT,
			'color' : color,
			'left' : randomFromTo(posObj.x * Game.BLOCKWIDTHHEIGHT,posObj.x * Game.BLOCKWIDTHHEIGHT + (width * Game.BLOCKWIDTHHEIGHT))
		})
	}
	this.animate = function(){
		$('#'+uID).animate({
			top:(posObj.y* Game.BLOCKWIDTHHEIGHT) - 30,
			opacity:0
		},{
			duration: 3000,
			easing: 'easeOutExpo',
			complete: function(){
				$('#'+uID).remove();
			}
		});
	}
}