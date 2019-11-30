//
//  MasterTetris.js
//  portfolio_trunk
//
//  Created by Robbie on 2012-02-13.
//  Copyright 2012 __MyCompanyName__. All rights reserved.
//
var isAuthorized = false;
var loginOpened = false;
var page = 0;

var up = true;
var down = true;

var me = {};
var slideshowcnt = 0;
const pos1 = 68;
const pos2 = 161;
const pos3 = 254;


function setupCanvasLoader() {
    //Debugger.log("setupCanvasLoader");
    var cl = new CanvasLoader('canvasloader-container');
    cl.setColor('#ffffff');
    // default is '#000000'
    cl.setDiameter(20);
    // default is 40
    cl.setDensity(15);
    // default is 40
    cl.setRange(1.2);
    // default is 1.3
    cl.setSpeed(1);
    // default is 2
    cl.setFPS(28);
    // default is 24
    cl.show();
    // Hidden by default
    var loaderObj = document.getElementById("canvasLoader");
    loaderObj.style.position = "absolute";
    loaderObj.style["top"] = cl.getDiameter() * -0.5 + "px";
    loaderObj.style["left"] = cl.getDiameter() * -0.5 + "px";
}


$(document).ready(function() {

    // ========================
    // = TRACE INITIALIZATION =
    // ========================
    Debugger.isTracing = true;
    Debugger.log("This browsers support for canvas is " + canvasSupport());
    Debugger.obj(jQuery.browser);

    // ======================
    // = CANVASSUPPORTCHECK =
    // ======================
    if (!canvasSupport() || jQuery.browser.msie) {
        $('#browser-error').css('display', 'block');
        $('#canvas').css('display', 'none');
        $('#buttons-introscreen').css('display', 'none');
        $('#footer').css('visibility', 'visible');
        $('#footer').css('opacity', 1);
    } else {
        var canvas1 = document.getElementById("canvas-fallingfield");
        var context1 = canvas1.getContext("2d");
        var canvas2 = document.getElementById("canvas-previewfield");
        var context2 = canvas2.getContext("2d");
        var canBegin = false;
        var game = new Game(context1, canvas1, context2, canvas2);
        game.init();
    }

    // ==================
    // = FACEBOOK STUFF =
    // ==================
    var permis = "publish_actions";
    function createfbBTN() {
        window.fbAsyncInit = function()
        {
            FB.init({
                appId: '248142925266729',
                status: true,
                // check login status
                cookie: true,
                // enable cookies to allow the server to access the session
                xfbml: true
                // parse XFBML
            });
            FB.getLoginStatus(onFacebookInitialLoginStatus);
        };
        (function(d) {
            var js,
            id = 'facebook-jssdk';
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            d.getElementsByTagName('head')[0].appendChild(js);
        } (document));
    }
    function facebookLogin() {
        Debugger.log("facebookLogin");
        FB.login(onFacebookLoginStatus, {
            scope: permis
        });
    }
    function onFacebookInitialLoginStatus(response) {
        Debugger.obj(response);
        Debugger.log("onFacebookInitialLoginStatus");
        if (response.status == "connected")
        {
            //DIRECTLY PLAY GAME
            authorized(response.authResponse.accessToken);
            //RETREIVE INFO(name etc)
            Debugger.log("Ready to play directly");
        } else if (response.status == "not_authorized")
        {
            //SHOW BUTTONS
            //SHOW AUTHORIZATION TT
            Debugger.log("Show Fb buttons onFacebookInitialLoginStatus");
        } else {
            //SHOW BUTTONS
            Debugger.log("Show Fb buttons onFacebookInitialLoginStatus");
        }
    }
    function onFacebookStatusChange(response) {
        Debugger.obj(response);
        Debugger.log("onFacebookStatusChange");
        if (response.status == "connected") {
            Debugger.log("connected");
            //STARTGAME
            authorized(response.authResponse.accessToken);
            launchGame();
            //RETREIVE INFO(name etc)
        } else if (response.status == "not_authorized") {
            Debugger.log("not_authorized");
            //KEEP SHOWING BUTTONS
            //SHOW AUTHORIZATION TT
        } else {
            Debugger.log("unknown");
            //KEEP SHOWING BUTTONS
        }
    }
    function onFacebookInitialLoginStatus(response) {
        Debugger.obj(response);
        Debugger.log("onFacebookInitialLoginStatus");
        if (response.status == "connected") {
            Debugger.log("connected");
            //facebookLogin();
            authorized(response.authResponse.accessToken);
            //DIRECTLY PLAY GAME
        } else if (response.status == "not_authorized") {
            Debugger.log("not_authorized");
            //SHOW AUTHORIZATION TT
        } else {
            Debugger.log("unknown");
            //SHOW BUTTONS
            Debugger.log("Show Fb buttons onFacebookInitialLoginStatus");
            //facebookLogin();
        }
    }
    function onFacebookLoginStatus(response) {
        Debugger.obj(response);
        Debugger.log("onFacebookLoginStatus");
        if (response.status == "connected") {
            Debugger.log("connected");
            //STARTGAME
            authorized(response.authResponse.accessToken);
            //RETREIVE INFO(name etc)
        } else if (response.status == "not_authorized") {
            Debugger.log("not_authorized");
            //SHOW BUTTONS
            //SHOW AUTHORIZATION TT
        } else {
            Debugger.log("unknown");
            //SHOW BUTTONS
        }
    }
    function authorized(token) {
        Debugger.log("authorized" + isAuthorized);
        if (!isAuthorized) {
            FB.api('/me',
            function(response) {
                me = response;
                Debugger.obj(response);
            });
            isAuthorized = true;
        }
    }
    // =====================
    // = INIT TETRIS STUFF =
    // =====================
    $('#intro').preload(function(loaded) {
        //Debugger.log("introAnim");
        setTimeout(function() {
            createfbBTN();
            $("#intro").animate({
                left: $(window).width() * .5
            },
            {
                duration: 700,
                easing: 'easeOutExpo',
                complete: function() {
                    $("#canvasloader-container").remove();
                    $("#canvasLoader").remove();
                }
            }
            )
        },
        1000);
    },
    function(found) {
        setupCanvasLoader();
    },
    function(found) {
        Debugger.log("endCallBack");
    });

    // =================
    // = BUTTON EVENTS =
    // =================
    $("#btn-1").click(function() {
        game.addMask();
        // if (!isAuthorized) {
        //     FB.Event.subscribe('auth.statusChange', onFacebookStatusChange);
        //     loginOpened = true;
        //     $("#enter-name").animate({
        //         top: 177
        //     },
        //     {
        //         duration: 700,
        //         easing: 'easeOutExpo'
        //     });
        // } else {
            launchGame();
        // }
        return false;
    });

    $("#btn-2").click(function() {
        game.addMask();
        $("#htp").animate({
            top: 10
        },
        {
            duration: 700,
            easing: 'easeOutExpo',
            complete: animateslideshow()
        })
        return false;
    });

    $("#htp-close").click(function() {
        game.removeMask();
        $("#htp").animate({
            top: -600
        },
        {
            duration: 700,
            easing: 'easeOutExpo'
        })
        return false;
    });

    //"#btn-3&9"
    $(".replay").click(function() {
        if ($(this).attr("ID") == "btn-3") {
            game.addMask();
            Debugger.log("Replay");
            $("#sure").css('left', $(window).width() * .5);
            $("#sure").css('top', '-100');
            $("#sure").addClass('repl');
            $("#sure p.smaller").text("The game wil restart! Scores will be lost");

            game.pause();
            game.gamePaused = true;
            showareyousure(function() {
                game.gamePaused = false;
            });
        } else {
            game.removeMask();
            $("#game-over").animate({
                top: -350
            },
            {
                duration: 700,
                easing: 'easeOutExpo'
            });
            $("#score-board").animate({
                top: -350
            },
            {
                duration: 700,
                easing: 'easeOutExpo',
                complete: reta
            });
        }
        function reta() {
            $(".highscoreMarker").css('display', 'none');
            $(".Badge").css('display', 'none');
            $(".Badge").css('opacity', '1');
            restart();
        }
        return false;
    });
    function restart() {
        Debugger.log("Replay");
        game.restart();
        game.init();
        game.start();
    }
    $("#btn-4").click(function() {
        Debugger.log("Pause");
        if (game.gamePaused) {
            $(this).css('background-position', '');
            game.play();
            game.gamePaused = false;
            hidePausePlay();
        } else {
            $(this).css('background-position', '-85px 0');
            game.pause();
            game.gamePaused = true;
            showPausePlay();
        }
        return false;
    });
    //"#btn-6&7&8" = SHARES
    $("#btn-8").click(function() {
        //NO FB BUTTON
        $("#sure").css('left', $(window).width() * .5);
        $("#sure").css('top', '-100');
        $("#sure").addClass('no-fb');
        $("#sure p.smaller").text("Your scores will not be saved!!!");
        showareyousure(function() {
            });

        return false;
    });
    $("#btn-12").click(function() {
        //YES
        game.removeMask();
        var fnc = function() {};
        if ($("#sure").hasClass('no-fb')) {
            $("#sure").removeClass('no-fb');
            fnc = launchGame;
        };
        if ($("#sure").hasClass('repl')) {
            $("#sure").removeClass('repl');
            fnc = restart;
        };

        hideareyousure(fnc);
        return false;
    });
    $("#btn-13").click(function() {
        //NO
        game.removeMask();
        var fnc = function() {};
        if ($("#sure").hasClass('no-fb')) {
            $("#sure").removeClass('no-fb');
        };
        if ($("#sure").hasClass('repl')) {
            $("#sure").removeClass('repl');
            fnc = function() {
                game.play();
                game.gamePaused = false;
            };
        };
        hideareyousure(fnc);
        return false;
    });
    $("#btn-14").click(function() {
        //PAUSEPLAY
        $("#btn-4").css('background-position', '');
        game.play();
        game.gamePaused = false;
        hidePausePlay();
        return false;
    });
    $("#up").click(function() {
        if (up) {
            Debugger.log("up" + up);
            if (game.checkPage("UP")) {
                page--;
                Debugger.log("game.checkPage('UP')" + page);
                game.animatepage();
            }
        }
        return false;
    });
    $("#down").click(function() {
        if (down) {
            Debugger.log("up" + up);
            if (game.checkPage("DOWN")) {
                page++;
                Debugger.log("game.checkPage('DOWN')" + page);
                game.animatepage();
            }
        }
        return false;
    });
    $("#slideshow-htp-left").click(function() {
        if (slideshowcnt > 0) {
            slideshowcnt--;
        }
        Debugger.log("slideshowcnt" + slideshowcnt);
        animateslideshow();
        return false;
    });
    $("#slideshow-htp-right").click(function() {
        Debugger.log($("#slideshow-htp-container img").size());
        if (slideshowcnt < ($("#slideshow-htp-container img").size() - 3)) {
            slideshowcnt++;
        }
        Debugger.log("slideshowcnt" + slideshowcnt);
        animateslideshow();
        return false;
    });


    function showareyousure(fnc) {
        Debugger.log("showareyousure");
        $("#sure").animate({
            top: 190
        },
        {
            duration: 700,
            easing: 'easeOutExpo',
            complete: fnc
        });
    }
    function hideareyousure(fnc) {
        $("#sure").animate({
            top: -100
        },
        {
            duration: 700,
            easing: 'easeOutExpo',
            complete: fnc
        });
    }

    function showPausePlay() {
        game.addMask();
        $("#pp").css('display', 'block');
        $("#pp").animate({
            opacity: 1
        },
        {
            duration: 700,
            easing: 'easeOutExpo'
        });
    }
    function hidePausePlay() {
        game.removeMask();
        $("#pp").animate({
            opacity: 1
        },
        {
            duration: 700,
            easing: 'easeOutExpo',
            complete: $("#pp").css('display', 'none')
        });
    }
    // ======================
    // = LAUNCHING THE GAME =
    // ======================
    function launchGame() {
        game.removeMask();
        $("#enter-name").animate({
            left: $(window).width() * .5 + $(window).width()
        },
        {
            duration: 700,
            easing: 'easeOutExpo'
        });
        setTimeout(function() {
            $("#intro").animate({
                left: $(window).width() * .5 + $(window).width()
            },
            {
                duration: 700,
                easing: 'easeOutExpo'
            })
        },
        300);
        setTimeout(function() {
            $("#game").animate({
                left: $(window).width() * .5
            },
            {
                duration: 700,
                easing: 'easeOutExpo'
            })
        },
        700);
        setTimeout(function() {
            $("#previewfield").animate({
                left: 638
            },
            {
                duration: 700,
                easing: 'easeOutBack'
            })
        },
        1400);
        setTimeout(function() {
            $("#scorefield").animate({
                left: 638
            },
            {
                duration: 700,
                easing: 'easeOutBack'
            })
        },
        1500);
        setTimeout(function() {
            $("#btn-3").animate({
                left: 0
            },
            {
                duration: 700,
                easing: 'easeOutBack'
            })
        },
        1600);
        setTimeout(function() {
            $("#btn-4").animate({
                left: 0
            },
            {
                duration: 700,
                easing: 'easeOutBack'
            })
        },
        1700);
        setTimeout(function() {
            $("#btn-5").animate({
                left: 0
            },
            {
                duration: 700,
                easing: 'easeOutBack'
            })
        },
        1800);
        setTimeout(function() {
            $("#btn-6").animate({
                left: 0
            },
            {
                duration: 700,
                easing: 'easeOutBack'
            },
            game.start())
        },
        1900);
    }
    function animateslideshow() {
        if (slideshowcnt > 0) {
            var c1 = slideshowcnt - 1;
            setTimeout(function() {
                $("#slideshow-htp-container img:eq(" + c1 + ")").animate({
                    left: 40,
                    opacity: 0
                },
                {
                    duration: 600,
                    easing: 'easeOutExpo'
                })
            },
            0);
        }
        setTimeout(function() {
            $("#slideshow-htp-container img:eq(" + slideshowcnt + ")").animate({
                left: pos1,
                opacity: 1
            },
            {
                duration: 600,
                easing: 'easeOutBack'
            })
        },
        50);
        setTimeout(function() {
            var c2 = slideshowcnt + 1;
            $("#slideshow-htp-container img:eq(" + c2 + ")").animate({
                left: pos2,
                opacity: 1
            },
            {
                duration: 600,
                easing: 'easeOutBack'
            })
        },
        100);
        setTimeout(function() {
            var c3 = slideshowcnt + 2;
            $("#slideshow-htp-container img:eq(" + c3 + ")").animate({
                left: pos3,
                opacity: 1
            },
            {
                duration: 600,
                easing: 'easeOutBack'
            })
        },
        150);
        setTimeout(function() {
            var c4 = slideshowcnt + 3;
            $("#slideshow-htp-container img:eq(" + c4 + ")").animate({
                left: 270,
                opacity: 0
            },
            {
                duration: 600,
                easing: 'easeOutBack'
            })
        },
        200);
    }
});
