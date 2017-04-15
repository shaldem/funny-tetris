// are we running in native app or in a browser?
$(document).ready(function(){
    window.isphone = false;
    if(document.URL.indexOf("http://") === -1
        && document.URL.indexOf("https://") === -1
		&& document.URL.indexOf("file://") === -1) {
        window.isphone = true;
    }

    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});


function  onDeviceReady (id) {
	var score = 0;
	$('#sc').text(score);


	var cwidth = 200;
	var cheight = 200;
	var step = 20;

	var fHlen = cheight/step;
	var fWlen = cwidth/step;

	var square = {
		pict: [[[1]], [[1]], [[1]], [[1]]]
	}
	var coner = {
		pict: [[[1,1],[1,0]], [[1,1],[0,1]], [[0,1],[1,1]], [[1,0],[1,1]]]
	}
	var stick = {
		pict: [[[1],[1],[1],[1]], [[1,1,1,1]], [[1],[1],[1],[1]], [[1,1,1,1]]]
	}
	var zigzag = {
		pict: [[[1,1,0],[0,1,1]], [[1,0],[1,1],[0,1]], [[0,1,1],[1,1,0]], [[0,1],[1,1],[1,0]]]
	}

	var figure = {
		curr: {
			shape: 0,
			state: 0
		},

		flist: [square,coner,stick,zigzag],

		checkRotL: function(x, y) {
			figure.rotL();
			if(!figure.checkRot(x, y) || figure.boardB(x,y) || !figure.boardRL(x,y))
				figure.rotR();
		},
		checkRotR: function(x, y) {
			figure.rotR();
			if(!figure.checkRot(x, y) || figure.boardB(x,y) || !figure.boardRL(x,y))
				figure.rotL();
		},
		glArrSet: function (x,y) {
			for(var i = 0; i < figure.getW(); i++){
				for(var j = 0; j < figure.getH(); j++){
					if(!fArr[x+i][y+j])
						fArr[x+i][y+j] = figure.flist[figure.curr.shape].pict[figure.curr.state][i][j];
				}
			}
		},
		glArrClr: function (x,y) {
			for(var i = 0; i < figure.getW(); i++){
				for(var j = 0; j < figure.getH(); j++){
					if(figure.flist[figure.curr.shape].pict[figure.curr.state][i][j])
						fArr[x+i][y+j] = 0;
				}
			}
		},
		boardL: function (x,y) {
			var h = figure.getH();
			var br = (x > 0);
			if(br) {
				for(var i = 0; i < h; i++)
					if (fArr[x - 1][y+i] != 0) {
						br = false;
						break;
					}
			}
			return br;
		},
		boardR: function (x,y) {
			var w = figure.getW();
			var h = figure.getH();

			var br = (x < (fWlen - w));
			if(br) {
				for(var i = 0; i < h; i++)
					if (fArr[x + w][y + i] !== 0) {
						br = false;
						break;
					}
			}
			return br;
		},
		boardRL: function (x,y) {
			return (figure.boardL(x,y) && figure.boardR(x,y));
		},
		boardT: function (x) {
			var stop = false;
			for(var i=0; i< fWlen; i++) {
				if(fArr[i][0] === 1) {
					stop = true;
					break;
				}
			}
			return stop;
		},
		boardB: function (x,y) {
			var h = figure.getH();
			var w = figure.getW();

			var dnBotRed = (y == (fHlen - (h - 1)));

			if(!dnBotRed) {
				for(var i=0; i<w; i++) {
					var Hi = figure.getHi(i);
					if(y>=0 && fArr[x+i][y+Hi-1] == 1){
						dnBotRed = true;
						break;
					}
				}
			}
			return dnBotRed;
		},
		getRnd: function(){
			figure.getRndF();
			figure.getRndS();
			return  figure.getRndX();
		},
		getHi: function(i){

			var h = figure.getH();

			var Hi = figure.flist[figure.curr.shape].pict[figure.curr.state][i][0];
			for(var j = 1; j < h; j++) {
				Hi += figure.flist[figure.curr.shape].pict[figure.curr.state][i][j];
			}

			return Hi;
		},
		/// PRIVATE
		rotL: function () {
			figure.curr.state = figure.curr.state == 0 ? 3 : figure.curr.state - 1;
		},
		rotR: function () {
			figure.curr.state = figure.curr.state == 3 ? 0 : figure.curr.state + 1;
		},
		checkRot: function(x, y) {
			var doRotate = true;
			if (figure.getH() + y > fHlen)
				doRotate = false;

			if (doRotate && x + figure.getW() > fWlen)
				doRotate = false;
			return doRotate;
		},
		getRndX: function(){
			return  getRandomRound(fWlen-figure.getW(), 0);
		},
		getRndS: function(){
			figure.curr.state = getRandomRound(3, 0);
		},
		getRndF: function(){
			figure.curr.shape = getRandomRound(figure.flist.length - 1, 0);
		},
		getW: function(){
			return figure.flist[figure.curr.shape].pict[figure.curr.state].length;
		},
		getH: function(){
			return figure.flist[figure.curr.shape].pict[figure.curr.state][0].length;
		}
	};

	var fArr;

	var cnt = $('canvas')[0].getContext("2d");

	var drow = function() {
		for(var i = 0; i < fArr.length; i++){
			for(var j = 0; j < fArr[i].length; j++){
				if(fArr[i][j] !== 0){
					cnt.fillStyle ="red";
				} else {
					cnt.fillStyle ="green";
				}
				cnt.beginPath();
				cnt.lineWidth="1";
				cnt.strokeStyle="white";
				cnt.rect(i*step,j*step,step,step);
				cnt.fill();
				cnt.stroke();
			}
		}
	}

	var clear = function() {
		if(!fArr)
			fArr = [];

		for(var i = 0; i < fHlen; i++){
			if(!fArr[i])
				fArr[i] = [];
			for(var j = 0; j < fWlen; j++){
				fArr[i][j] = 0;
			}
		}
	}
	var getRandomRound = function(max, min){
		return Math.round(Math.random() * (max-min) + min);
	}

	var start = function() {
		var inter;
		var x = figure.getRnd();
		var y = 0;

		clear();

		var removeString = function(y) {
			score += 1;
			$('#sc').text(score);

			for(var i = 0; i < fWlen; i++) {
				for(var j = y; j > 0; j--) {
					var p = fArr[i][j-1];
					fArr[i][j] = p;
				}
			}
		}

		var checkBonus = function() {
			var sum = 0;
			var rm = [];
			for(var j = fHlen-1; j >= 0; j--) {
				sum = 0;

				for(var i = 0; i < fWlen; i++){
					sum += fArr[i][j];
				}

				if(sum == fWlen) {
					rm.push(j);
				}
			}

			for(var i = 0; i < rm.length; i++){
				removeString(fHlen-1);
			}
			drow();
		}

		var move = function() {

			figure.glArrSet(x,y);
			drow();
			figure.glArrClr(x,y);

			y++;

			if(figure.boardB(x,y))
			{
				figure.glArrSet(x,y-1);
				if(figure.boardT(x)) {
					alert("GAME OVER!!! Your score " + score + "!!!");
					clearInterval(inter);
					return -1;
				}

				checkBonus();
				x = figure.getRnd();
				y = 0;
				return 0;
			}
			return 1;
		}
		
		var oDirect = {
			upx:0,
			upy:0,
			downx:0,
			downy:0,
			setUpCoord:function(x,y){
				this.upx = x;
				this.upy = y;
			},
			setDownCoord:function(x,y){
				this.downx = x;
				this.downy = y;
			},
			getDirection:function(){
				var difVert = this.downy - this.upy;
				var difHor = this.downx - this.upx;
				if(Math.abs(difHor) > Math.abs(difVert)) {
					if(difHor>=0)
						return "left";
					else
						return "right";
				}
				else {
					if(difVert>=0)
						return "up";
					else
						return "down";
				}
			}
		}
		
		$(document).on({ 'keydown mouseup touchend' : function(e){
			var direcT;
			if(e.type == 'keydown')
				switch(e.which)
				{
					case 37:
						direcT = 'left';
						break;
					case 38:
						direcT = 'up';
						break;
					case 39:
						direcT = 'right';
						break;
					case 40:
						direcT = 'down';
						break;
				}
			else if (e.type == 'touchend') {
				oDirect.setUpCoord(e.originalEvent.changedTouches[0].clientX, e.originalEvent.changedTouches[0].clientY);
				direcT = oDirect.getDirection();
			}
			else if(e.type == 'mouseup') {
				oDirect.setUpCoord(e.clientX, e.clientY);
				direcT = oDirect.getDirection();
			}
			
			if(direcT == "left") {
				if(figure.boardL(x,y)) {
					figure.glArrClr(x,y);
					x -= 1;
				}
			}
			else if(direcT == "up") figure.checkRotL(x,y);
			else if(direcT == "right") {
				if(figure.boardR(x,y)) {
					figure.glArrClr(x,y);
					x += 1;
				}
			}
			else if(direcT == "down") while(move() == 1);
		} });
		
		$(document).on({ 'mousedown' : function(e){
			oDirect.setDownCoord(e.clientX, e.clientY);
		} });
		
		$(document).on({ 'touchstart' : function(e){
			oDirect.setDownCoord(e.originalEvent.changedTouches[0].clientX, e.originalEvent.changedTouches[0].clientY);
		} });

		inter = setInterval(move, 500);
	}

	start();
};
