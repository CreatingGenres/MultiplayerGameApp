(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
                                function (callback) {
                                    //console.log("fallbacking");
                                    setTimeout(callback, 1000 / 60);
                                };
    window.requestAnimationFrame = requestAnimationFrame;
})();
var canvas = document.getElementById("game-canvas");
var context = canvas.getContext("2d");
///NE BARAITE REDOVETE NAGORE!

var ballsX = [],
    ballsY = [],
    ballsAlpha = []; //Suzdadohme si tri masiva. Pazim si koordinati i alfa.

var ballsCount = 0; //pazim si broi topki

function zele() {//koda napisan vuv va6a vunkcia puk se izpulnqva 4ak kato q izvikame otnqkude
    console.log("zle.si"); //printva v console-a. natisnete 	F12 da q vidite
}

function update() {

    for (var i = 0; i < ballsCount; i++) {
        ballsAlpha[i] -= 0.01;

        if (ballsAlpha[i] <= 0) {
            ballsX[i] = ballsX[ballsCount - 1];
            ballsY[i] = ballsY[ballsCount - 1];
            ballsAlpha[i] = ballsAlpha[ballsCount - 1];

            //REVIEW: Ask Qshu for appropriate description.
            i--;
            ballsCount--;
        }
    }

    setTimeout(update, 10);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);	//NEBAR!
    context.globalAlpha = 1;    				//NEBAR!

    for (var i = 0; i < ballsCount; i++) {
        context.globalAlpha = ballsAlpha[i];
        context.beginPath();

        context.arc(ballsX[i], ballsY[i], 10, 0, 2 * Math.PI);

        //REVIEW: Ask Qshu for appropriate description.
        context.closePath();
        context.fill();
    }

    requestAnimationFrame(draw); //NEBAR
}

onReady = function () {
    var zapochnahmeLiDaChertaem = false;
    //console.log("onReady");

    window.addEventListener("mousedown", function () {
        zapochnahmeLiDaChertaem = true; //CHERTAI
    }, false);

    window.addEventListener("mousemove", function (args) {
        if (zapochnahmeLiDaChertaem) {
            var x = args.x || args.clientX; //kude e premestena mishkata po x
            var y = args.y || args.clientY; //kude e premestena mishkata po y

            //dobavqme nova topka i kazvame, che e napulno neprozrachna
            ballsX[ballsCount] = x;
            ballsY[ballsCount] = y;
            ballsAlpha[ballsCount] = 1;
            ballsCount++;

            sendToRoom({ x: x, y: y }); //prashtame do drugite, che sme postavili topka
            //REVIEW: Ask Qshu for this shit.
        }
    }, false);

    window.addEventListener("mouseup", function () {
        zapochnahmeLiDaChertaem = false; //mi, sprqhme
    }, false);
};

userLeft = function (id) {
    //console.log(id + " otide da qde popara");
    //tova se vika, kogato nqkoi izleze ot igrata
}

receiveFromRoom = function (id, data) {
    //kato poluchim suobshtenie ot nqkogo-a, che
    //e postavil topka nqkude, q risuvame tam

    var x = data.x;
    var y = data.y;
    ballsX[ballsCount] = x;
    ballsY[ballsCount] = y;
    ballsAlpha[ballsCount] = 1;
    ballsCount++;

}

update();	//purvo vikane. ne go zatrivai!
draw();	//purvo vikane. ne go zatrivai!