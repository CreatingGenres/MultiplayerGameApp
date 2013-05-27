$(window).load(function () {
    var fixDimensions = function fixDimensions() {
        var canvasContainer = $("#game-canvas");
        var canvas = canvasContainer[0];
        canvas.width = canvasContainer.width();
        canvas.height = canvasContainer.height();
    }
     
    fixDimensions();
    $(window).resize(fixDimensions);

    var startButton = $("#start-game-button");
    startButton.click(function () {
        if (startButton.text() == "Play") {
            $("#start-game-button").text("Leave");
            window.startGame();
            $("#loading-bar").fadeIn();
        }
        else if (startButton.text() == "Leave")
            window.gameOver();

    });
});

$(window).load(function () {
    $("#hide-menu").click(function (e) {
        console.log("asdf");
        $("#main-menu").animate({ left: '97%' });
        e.stopPropagation();
    });

    $("#main-menu").click(function () {

        $("#main-menu").animate({ left: '91%' });
    });

    setTimeout(function () {
        $("#main-menu").animate({ left: '91%' });

        $("#our-logo").fadeOut();
        $("#game-logo").fadeOut();
    }, 4000);

    var dotsArray = [".", "..", "..."];

    setInterval(function () {
        var dots = $("#dot-span").text().length;
        dots = (dots + 1) % 3 + 1;
        var text = dotsArray[dots];
        $("#dot-span").text(text);
    }, 1000);
});