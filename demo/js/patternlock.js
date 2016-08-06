class PatternLock {
		
		//basic pattern lock configeration
	constructor(config){
		this.patternSize = config.patternSize || [3,3];
		this.dotColor = config.dotColor || '#00FF26';
		this.dotArray = [];
		this.joinArray = []; //dots joined
		this.dotSize = config.dotSize || 10;
		this.effRadius = this.dotSize + 10;
		this.vibrate = (config.vibrate === undefined) ? true : config.vibrate;
		this.minJoinDots = config.minJoinDots || 3;
		//set up the canvas
		this.canvas = document.getElementById(config.canvasId);
		this.ctx = this.canvas
		.getContext('2d');
		this.ctx.fillStyle = this.dotColor;
		this.ctx.strokeStyle = this.dotColor;
		this.ctx.lineWidth = this.dotSize-2;
		this.ctx.lineCap = 'round';
		this.setDotArray();
		this.createDots();
	}
	
	//create lock screen on the canvas
	createLock(callback){
		this.callback = callback;
		parent = this;
		this.canvas.addEventListener('touchstart',
		function(e){
			let rX = e.touches[0].clientX - this.getBoundingClientRect().left;
			let rY = e.touches[0].clientY - this.getBoundingClientRect().top;
			parent.checkPosition(rX, rY);
			//parent.createPattern(rX, rY);
			
		});
		
		this.canvas.addEventListener('touchmove',
		function(e){
			e.preventDefault();
			let rX = e.touches[0].clientX - this.getBoundingClientRect().left;
			let rY = e.touches[0].clientY - this.getBoundingClientRect().top;
			parent.checkPosition(rX, rY);
			parent.createPattern(rX, rY);
		});
		
		this.canvas.addEventListener('touchend',
		function(){
			if(parent.joinArray.length>=parent.minJoinDots){
				var combination = parent.joinArray.reduce((pre, cur)=>{
				return pre.toString() + cur.toString();
			});
				parent.resetLock();
				parent.callback(false, combination);
			}else{
				parent.resetLock();
				parent.callback('Error: You must join atleast ' + parent.minJoinDots + ' dots', null);
			}
		});
	}
	//create dots on the canvas
	createDots(){
		for (var i = 0; i < this.dotArray.length; i++){
			let xCord = this.dotArray[i][0];
			let yCord = this.dotArray[i][1];
			this.drawCircle(xCord, yCord);
		}
	};
	//draw circle
	drawCircle(x, y){
		this.ctx.beginPath();
		this.ctx.arc(x, y, this.dotSize, 0, 2*Math.PI);
		this.ctx.fill();
	}
	//check the position of the touch relative to dots
	checkPosition(x, y){
		for(var j=0; j<this.dotArray.length; j++){
			if(x>this.dotArray[j][0]-this.effRadius && x<this.dotArray[j][0]+this.effRadius && y>this.dotArray[j][1]-this.effRadius && y<this.dotArray[j][1]+this.effRadius && !this.joinArray.includes(j)){
				this.joinArray.unshift(j);
				if(this.vibrate)
					window.navigator.vibrate(100); 
			}
		}
	}
	//join the dots by joining the lines
	createPattern(x, y){
		this.clearCanvas();
		this.createDots();
		this.ctx.moveTo(x, y);
		if(this.joinArray.length>0){
			for(var k=0; k<this.joinArray.length; k++){
				this.drawLine(this.joinArray[k]);
			}
			this.ctx.stroke();
		}
		
	}
	clearCanvas(){
		this.ctx.clearRect(0, 0, 300, 400);
	}
	drawLine(val){
		this.ctx.lineTo(this.dotArray[val][0], this.dotArray[val][1]);
	
	}
	//reset the pattern lock i.e, clear the joinDots array and clear the canvas
	resetLock(){
		this.joinArray = [];
		this.clearCanvas();
		this.createDots();
	}
	 setDotArray(){
	 	let rows = this.patternSize[0],
	 	cols = this.patternSize[1],
	 	canvasWidth = this.canvas.clientWidth,
	 	canvasHeight = this.canvas.clientHeight,
	 	paddingR = canvasWidth/20,
	 	paddingC = canvasHeight/20,
	 	rowsDotSpacing = (canvasHeight-paddingC*2)/(rows-1),
	 	colsDotSpacing = (canvasWidth-paddingR*2)/(cols-1);
	 	
	 	if(rowsDotSpacing > this.effRadius*3 && colsDotSpacing > this.effRadius*3){
	 		for(let i=0; i<rows; i++){
	 		for(let j=0; j<cols; j++){
	 			let xCord = (j*colsDotSpacing) + paddingR;
	 			let yCord = (i*rowsDotSpacing) + paddingC;
	 			this.dotArray.push([xCord, yCord]);
	 		}
	 	}
	 	}else{
	 		console.log('Error: Dots are too close-please increase the width and height of your canvas');
	 	}
	 }
}