window.onload = function(){
    window.isphone = false;
    if(document.URL.indexOf("http://") === -1
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;
    }

    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        app.onDeviceReady();
    }
};


var app = {
    // Update DOM on a Received Event
    onDeviceReady: function(id) {
        var eScore = document.getElementById("sc");
        var score = 0;
        eScore.innerHTML = score;


        var cwidth = 400;
        var cheight = 400;
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

        var figure = {
            curr: {
                shape: 0,
                state: 0
            },

            flist: [square,coner,stick],

            rotL: function () {
                this.curr.state = this.curr.state == 0 ? 3 : this.curr.state - 1;
            },
            rotR: function () {
                this.curr.state = this.curr.state == 3 ? 0 : this.curr.state + 1;
            },
            glArrSet: function (x,y) {
                for(var i = 0; i < this.getW(); i++){
                    for(var j = 0; j < this.getH(); j++){
                        if(!fArr[x+i][y+j])
                            fArr[x+i][y+j] = this.flist[this.curr.shape].pict[this.curr.state][i][j];
                    }
                }
            },
            glArrClr: function (x,y) {
                for(var i = 0; i < this.getW(); i++){
                    for(var j = 0; j < this.getH(); j++){
                        if(this.flist[this.curr.shape].pict[this.curr.state][i][j])
                            fArr[x+i][y+j] = 0;
                    }
                }
            },
            onMoveR: function (x,y) {
                this.glArrClr(x,y);
            },
            onMoveL: function (x,y) {
                this.glArrClr(x,y);
            },
            boardL: function (x,y) {
                // @todo shape
                return (x > 0 && (fArr[x - 1][y] === 0));
            },
            boardR: function (x,y) {
                // @todo shape
                var w = figure.getW();
                return (x < (fWlen - w) && (fArr[x + w][y] === 0));
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
                        var Hi = this.getHi(i);
                        if(y>=0 && fArr[x+i][y+Hi-1] == 1){
                            dnBotRed = true;
                            break;
                        }
                    }
                }
                return dnBotRed;
            },
            getRnd: function(){
                this.getRndF();
                return  this.getRndX();
            },
            getHi: function(i){

                var h = this.getH();

                var Hi = this.flist[this.curr.shape].pict[this.curr.state][i][0];
                for(var j = 1; j < h; j++) {
                    Hi += this.flist[this.curr.shape].pict[this.curr.state][i][j];
                }

                return Hi;
            },
            /// PRIVATE
            getRndX: function(){
                return  getRandomRound(fWlen-this.getW(), 0);
            },
            getRndF: function(){
                this.curr.shape = getRandomRound(this.flist.length - 1, 0);
                //this.curr.shape = 0;
                //this.curr.shape = 2;
            },
            getW: function(){
                return this.flist[this.curr.shape].pict[this.curr.state].length;
            },
            getH: function(){
                return this.flist[this.curr.shape].pict[this.curr.state][0].length;
            }
        };

        var fArr;

        var cnv = document.getElementById('cnv');
        var cnt = cnv.getContext("2d");

        var drow = function() {
            for(var i = 0; i < fArr.length; i++){
                for(var j = 0; j < fArr[i].length; j++){
                    if(fArr[i][j] !== 0){
                        cnt.fillStyle ="red";
                    } else {
                        cnt.fillStyle ="green";
                    }
                    cnt.fillRect(i*step,j*step,step,step);
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
                eScore.innerHTML = score;

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
                    removeString(rm[i]);
                }
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
                        window.removeEventListener("keydown", function(){});
                        alert("GAME OVER!!! Your score " + score + "!!!");
                        clearInterval(inter);
                        return;
                    }

                    checkBonus();
                    x = figure.getRnd();
                    y = 0;
                }
            }

            window.addEventListener("keydown", function(e) {
                var key = e.which;
                if (key == "37" && figure.boardL(x,y)) {
                    figure.onMoveL(x,y);
                    x -= 1;
                }
                if (key == "39" && figure.boardR(x,y)) {
                    figure.onMoveR(x,y);
                    x += 1;
                }

                if (key == "38") {
                    figure.rotL();
                }

                if (key == "40") {
                    figure.rotR();
                }
            });

            inter = setInterval(move, 500);
        }

        start();
    }
};