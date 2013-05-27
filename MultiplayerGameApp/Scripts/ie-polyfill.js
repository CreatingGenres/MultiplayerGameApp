console.log("asdf");

$(window).load(function () {
    
    var gameLogo = $("#game-logo"),
        ourLogo = $("#our-logo");
    gameLogo.css("opacity", 1);
    gameLogo.animate({ top: '40%', opacity: 1 }, 1000, function () {
        setTimeout(function () {
            gameLogo.animate({ top: '150%' }, 750, function () {
                ourLogo.css("opacity", 1);
                console.log("an2");
                ourLogo.animate({ top: '40%', opacity: 1 }, 1000, function () {
                    setTimeout(function () {
                        ourLogo.animate({ top: '150%' }, 750);
                    }, 500);
                });
            });
        }, 500);
    });

});