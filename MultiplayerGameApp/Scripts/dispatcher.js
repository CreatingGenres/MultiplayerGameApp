/// <reference path="jquery-1.6.4-vsdoc.js" />
/// <reference path="jquery.signalR-1.1.0-beta1.js" />
/// <reference path="jquery-1.6.4.js" />
/// 
(function () {
    var dispatcher = (function () {
        $.connection.hub.url = "http://patence.apphb.com/signalr/";
        var server = $.connection.dispatcher.server,
            client = $.connection.dispatcher.client;

        var gameName = "test",
            numOfPlayers = 0;

        $(window).load(function () {
            $.connection.hub.start().done(function () {
                //TODO: shit

            });

            if (!$("#our-logo").text().indexOf("Creating Genres") == -1)
                CRASHCRASHCRASH;
        });

        function startGame() {
            if (this.numberOfPlayers)
                server.queueForGame(this.gameName, this.numberOfPlayers);
        }

        function gameOver() {
            server.leaveGame();
            $("#game-container nav").show();
            $("#game-canvas").hide();
            $("#start-game-button").text("Play");
            $("#loading-bar").fadeOut();
        }

        client.gameStarted = function () {
            $("#game-canvas").show();
            $("#start-game-button").text("Leave");
            $("#loading-bar").fadeOut();
        }

        return {
            server: server,
            client: client,
            gameName: gameName,
            numberOfPlayers: numOfPlayers,
            startGame: startGame,
            gameOver: gameOver,
        };
    })();

    //ui shit
    $(window).load(function () {
        $("#game-logo").text(dispatcher.gameName);
        $("head title").text(gameName);
        $("#start-game-button").text("Play");
        $("#game-canvas").hide();
    });

    // Add stuff to the window object since our little negros cant handle OOP

    Object.defineProperties(window, {
        "gameName": {
            get: function () { return dispatcher.gameName; },
            set: function (name) { dispatcher.gameName = name; },
            configurable: false,
            enumerable: false,
        },

        "numberOfPlayers": {
            get: function () { return dispatcher.numberOfPlayers },
            set: function (numOfPlayers) { dispatcher.numberOfPlayers = numOfPlayers; },
            configurable: false,
            enumerable: false,
        },

        "receiveFromRoom": {
            get: function () { return dispatcher.client.receiveFromRoom; },
            set: function (func) { dispatcher.client.receiveFromRoom = func; },
            configurable: false,
            enumerable: false,
        },

        "userLeft": {
            get: function () { return dispatcher.client.userLeft; },
            set: function (func) { dispatcher.client.userLeft = func; },
            configurable: false,
            enumerable: false,            
        },

        "sendToRoom": {
            value: dispatcher.server.sendToRoom,
            writable: false,
            configurable: false,
            enumerable: false,
        },

        "gameOver": {
            value: dispatcher.gameOver,
            writable: false,
            configurable: false,
            enumerable: false,
        },

        "startGame": {
            value: dispatcher.startGame,
            writable: false,
            configurable: false,
            enumerable: false,
        },

        "onReady": {
            set: function (func) {
                $.connection.hub.start().done(func);
            },
        }
    });
})();
