//
//  Game.js
//  portfolio_trunk
//
//  Created by Robbie on 2012-02-13.
//  Copyright 2012 __MyCompanyName__. All rights reserved.
//
function Game(contextfaling, canvasfaling, contextperview, canvaspreview) {
    (contextfaling === undefined) ? this.contextfaling = 0: this.contextfaling = contextfaling;
    (canvasfaling === undefined) ? this.canvasfaling = 0: this.canvasfaling = canvasfaling;
    (contextperview === undefined) ? this.contextperview = 0: this.contextperview = contextperview;
    (canvaspreview === undefined) ? this.canvaspreview = 0: this.canvaspreview = canvaspreview;

    this.gamePaused = false;
    const FRAME_RATE = 60;
    // ==============
    // = LOCAL VARS =
    // ==============
    var level = 1;
    var lines = 0;
    var score = 0;
    var gameKeyboardEnabled = false;
    var key_press_list = [];
    var dropIntervalID = 1;
    var lineIntervalID = 2;
    var dropInterval = Game.INITDROPINTERVAL;
    var levelScoreDifference = 750;
    var activeblock;
    var previewblock;
    var tower = [];
    // ====================
    // = PUBLIC FUNCTIONS =
    // ====================
    this.init = function() {
        setLevel(level);
        setLines(lines);
        setScore(score);
        previewblock = getRandomblock();
        drawPreviewBlock();
    }
    this.start = function() {
        gameKeyboardEnabled = true;
        setDropInterval();
        generatenewBlock();
    }
    this.restart = function() {
        //displayAreYouSure
        gameKeyboardEnabled = false;
        clearInterval(dropIntervalID);
        previewblock = null;
        activeblock = null;
        tower = [];
        level = 1;
        lines = 0;
        score = 0;
        setLevel(level);
        setLines(lines);
        setScore(score);
        dropInterval = Game.INITDROPINTERVAL;
        levelMultiplier = 0;
        levelScoreDifference = 1000;
        contextperview.clearRect(0, 0, canvaspreview.width, canvaspreview.height);
        contextfaling.clearRect(0, 0, canvasfaling.width, canvasfaling.height);
    }
    this.pause = function() {
        gameKeyboardEnabled = false;
        clearInterval(dropIntervalID);
    }
    this.play = function() {
        setDropInterval();
        gameKeyboardEnabled = true;
    }
    this.animatepage = function() {
        animatepageins();
    }
    this.checkPage = function(str) {
        return checkPageins(str);
    }
    this.addMask = function() {
        addmask();
    }
    this.removeMask = function() {
        removemask();
    }
    function setDropInterval() {
        dropIntervalID = setInterval(updateFalling, dropInterval);
    }
    function generatenewBlock() {
        activeblock = previewblock;
        previewblock = getRandomblock();
        //clear and drawpreview
        drawPreviewBlock();
        //moveactiveTomid and draw
        activeblock.move(Game.PLAYFIELDWIDTH * .5 - Math.floor(activeblock.width * .5), activeblock.blockcoords.y);
        drawFallingBlock();
    }
    function drawPreviewBlock() {
        contextperview.clearRect(0, 0, canvaspreview.width, canvaspreview.height);
        previewblock.draw(contextperview, canvaspreview);
    }
    function drawFallingBlock() {
        activeblock.draw(contextfaling, canvasfaling);
    }
    function drawTower() {
        for (var i = 0; i < tower.length; i++) {
            contextfaling.fillStyle = tower[i].color;
            contextfaling.fillRect((tower[i].x * Game.BLOCKWIDTHHEIGHT) + Game.BLOCKOFFSET, (tower[i].y * Game.BLOCKWIDTHHEIGHT) + Game.BLOCKOFFSET, Game.BLOCKWIDTHHEIGHT - (Game.BLOCKOFFSET * 2), Game.BLOCKWIDTHHEIGHT - (Game.BLOCKOFFSET * 2));
            contextfaling.clearRect((tower[i].x * Game.BLOCKWIDTHHEIGHT) + Game.BLOCKCLEARRECTWIDTHHEIGHT, (tower[i].y * Game.BLOCKWIDTHHEIGHT) + Game.BLOCKCLEARRECTWIDTHHEIGHT, Game.BLOCKCLEARRECTWIDTHHEIGHT, Game.BLOCKCLEARRECTWIDTHHEIGHT);
        }
    }
    function updateFalling() {
        if (bottomCheck() && towerCheck(Game.DIR_BOTTOM)) {
            contextfaling.clearRect(0, 0, canvasfaling.width, canvasfaling.height);
            activeblock.move(activeblock.blockcoords.x, activeblock.blockcoords.y + 1);
            drawFallingBlock();
            drawTower();
        } else {
            addtotower();
            fetchlines();
            generatenewBlock();
        }
    }
    function addtotower() {
        var pieces = activeblock.getpieces();
        for (i = 0; i < pieces.length; i++) {
            tower.push(pieces[i]);
        }
        if (gameOverCheck()) {
            gameOver();
        } else {
            addAndShowScore();
        }

    }
    function gameOver() {
        $('#game-over p').text(stringDotify(score));
        gameKeyboardEnabled = false;
        clearInterval(dropIntervalID);
        // if (isAuthorized) {
        //     Debugger.log("isAuthorized");
        //     var post_data = {
        //         name: me.name,
        //         score: score,
        //         fb_id: me.id
        //     }
        //     $.ajax({
        //         url: "game/tetris/savesscoreandgetcores",
        //         type: "POST",
        //         data: post_data,
        //         success: function(return_object) {
        //             Debugger.obj(return_object);
        //             Debugger.log(return_object);
        //             $('#tbl-body').empty();
        //             $('#tbl-body').append(return_object.tableflow);
        //             $('#tbl-body tr:eq(0)').css('color', '#e5c326');
        //             $('#tbl-body tr:eq(1)').css('color', '#8bbbba');
        //             $('#tbl-body tr:eq(2)').css('color', '#b5752b');
        //             //dotify every score in the table
        //             $('#tbl-body tr').find('td:eq(1)').text(function(index) {
        //                 if ($(this).text() != "") {
        //                     return stringDotify($(this).text());
        //                 }
        //             });
                    showscoreboardandgameOver({});
        //         }
        //     });
        // } else {
        //     $.ajax({
        //         url: "game/tetris/getJSONscores",
        //         type: "GET",
        //         success: function(return_object) {
        //             $('#tbl-body').empty();
        //             $('#tbl-body').append(return_object.tableflow);
        //             $('#tbl-body tr:eq(0)').css('color', '#e5c326');
        //             $('#tbl-body tr:eq(1)').css('color', '#8bbbba');
        //             $('#tbl-body tr:eq(2)').css('color', '#b5752b');
        //             //dotify every score in the table
        //             $('#tbl-body tr').find('td:eq(1)').text(function(index) {
        //                 if ($(this).text() != "") {
        //                     return stringDotify($(this).text());
        //                 }
        //             });
        //             showscoreboardandgameOver(return_object);
        //         }
        //     });
        // }

        function showscoreboardandgameOver(return_object) {
            addmask();
            $("#game-over").animate({
                top: 180
            },
            {
                duration: 700,
                easing: 'easeOutExpo'
            });

            $("#score-board").animate({
                top: 180
            },
            {
                duration: 700,
                easing: 'easeOutExpo'
            },
            showgameover(return_object));
        }

        function showgameover(return_object) {
            $("#game-over").animate({
                top: 90
            },
            {
                duration: 700,
                easing: 'easeOutExpo'
            });
            function animatePAGAndRest() {
                if (return_object.page == undefined) {
                    page = 0;
                } else {
										if (return_object.recordBroken == true){
	                    if (return_object.position == 1) {
	                        $(".first").css('display', 'block');
	                        $(".highscoreMarker.first").css('top', '60px');
	                        $(".Badge.first").css('opacity', '0');
	                        $(".highscoreMarker.first").animate({
	                            top: 3
	                        },
	                        {
	                            duration: 700,
	                            easing: 'easeOutExpo'
	                        });
	                        setTimeout(function() {
	                            $(".Badge.first").animate({
	                                opacity: 1
	                            },
	                            {
	                                duration: 600,
	                                easing: 'easeOutBack'
	                            })
	                        },
	                        500);
	                    }
	                    if (return_object.position == 2) {
	                        $(".second").css('display', 'block');
	                        $(".highscoreMarker.second").css('top', '60px');
	                        $(".Badge.second").css('opacity', '0');
	                        $(".highscoreMarker.second").animate({
	                            top: 3
	                        },
	                        {
	                            duration: 700,
	                            easing: 'easeOutExpo'
	                        });
	                        setTimeout(function() {
	                            $(".Badge.second").animate({
	                                opacity: 1
	                            },
	                            {
	                                duration: 600,
	                                easing: 'easeOutBack'
	                            })
	                        },
	                        500);
	                    }
	                    if (return_object.position == 3) {
	                        $(".third").css('display', 'block');
	                        $(".highscoreMarker.third").css('top', '60px');
	                        $(".Badge.third").css('opacity', '0');
	                        $(".highscoreMarker.third").animate({
	                            top: 3
	                        },
	                        {
	                            duration: 700,
	                            easing: 'easeOutExpo'
	                        });
	                        setTimeout(function() {
	                            $(".Badge.third").animate({
	                                opacity: 1
	                            },
	                            {
	                                duration: 600,
	                                easing: 'easeOutBack'
	                            })
	                        },
	                        500);
	                    }
										}
                    if ((return_object.recordBroken == true) && (return_object.position != 1) && (return_object.position != 2) && (return_object.position != 3)) {
                        $(".up").css('display', 'block');
                        $(".highscoreMarker.up").css('top', '60px');
                        $(".highscoreMarker.up").animate({
                            top: 3
                        },
                        {
                            duration: 700,
                            easing: 'easeOutExpo'
                        });
                    }
                    page = return_object.page;
                }
                animatepageins();
            }
        }
    }
    function gameOverCheck() {
        for (i = 0; i < tower.length; i++) {
            if (tower[i].y <= 1) {
                return true;
            }
        }
        return false;
    }
    function fetchlines() {
        //		Debugger.log("fetchlines");
        var arrY = activeblock.getCurrentYs();
        //		Debugger.obj(arrY);
        var linecnt = 0;
        for (i = 0; i < arrY.length; i++) {
            if (linecheck(arrY[i])) {
                deployWhiteLine(arrY[i], linecnt);
                removeLine(arrY[i]);

                //repositionLine(arrY[i]);
                linecnt++;
            }
        }
        contextfaling.clearRect(0, 0, canvasfaling.width, canvasfaling.height);
        //		drawFallingBlock();
        drawTower();
        if (linecnt != 0) addAndShowLines(linecnt);
    }
    function deployWhiteLine(yPos, lncnt) {
        //		Debugger.log("deployWhiteLine");
        var line = '<div id="' + yPos + '" style="top:' + yPos * Game.BLOCKWIDTHHEIGHT + 'px"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>';
        $('#fallingfield').append(line);
        $('#fallingfield span').css('opacity', '1');
        var cnt = 0;
        $('#' + yPos + ' span').each(function() {
            var span = $(this);
            if (cnt < 9) {
                setTimeout(function() {
                    span.animate({
                        opacity: 0
                    },
                    {
                        duration: 400,
                        easing: 'easeInOutCubic'
                    })
                },
                40 * (cnt + (10 * lncnt)));
            } else {
                setTimeout(function() {
                    span.animate({
                        opacity: 0
                    },
                    {
                        duration: 400,
                        easing: 'easeInOutCubic',
                        complete: function() {
                            repositionLine(yPos);
                            contextfaling.clearRect(0, 0, canvasfaling.width, canvasfaling.height);
                            drawFallingBlock();
                            drawTower();
                            $('#' + yPos).remove();
                        }
                    })
                },
                40 * (cnt + (10 * lncnt)));
            }
            cnt += 1;
            //			Debugger.log("yPos"+yPos);
        });
    }
    function repositionLine(yPos) {
        Debugger.log("repositionLine");
        Debugger.log("yPos" + yPos);
        var i = tower.length;
        while (i--) {
            if (tower[i].y < yPos) tower[i].y++;
        }
    }
    function removeLine(yPos) {
        Debugger.log("repositionLine");
        Debugger.log("yPos" + yPos);
        var i = tower.length;
        while (i--) {
            if (tower[i].y == yPos) tower.splice(i, 1);
        }
    }
    function rotationCheck() {
        var retVal = true;
        for (var i = 0; i < activeblock.positionArr.length; i++) {
            //Rows
            for (var j = 0; j < activeblock.positionArr[i].length; j++) {
                //Colls
                if (activeblock.positionArr[i][j] == 1) {
                    //BANDSCHECK
                    if (((activeblock.blockcoords.x + j) >= Game.PLAYFIELDWIDTH) || ((activeblock.blockcoords.x + j + 1) <= 0) || (Game.PLAYFIELDHEIGHT == (activeblock.blockcoords.y + i + 1))) {
                        retVal = false;
                    }
                    //TOWERCHECK
                    for (var k = 0; k < tower.length; k++) {
                        if (tower[k].x == (activeblock.blockcoords.x + j) && (tower[k].y == activeblock.blockcoords.y + i)) {
                            retVal = false;
                        }
                    }
                }
            }
        }
        return retVal;
    }
    function bottomCheck() {
        var retVal = true;
        for (var i = 0; i < activeblock.positionArr.length; i++) {
            //Rows
            for (var j = 0; j < activeblock.positionArr[i].length; j++) {
                //Colls
                if (activeblock.positionArr[i][j] == 1) {
                    //CHECK
                    if (Game.PLAYFIELDHEIGHT == (activeblock.blockcoords.y + i + 1)) {
                        retVal = false;
                    }
                }
            }
        }
        return retVal;
    }
    function towerCheck(direction) {
        switch (direction) {
        case Game.DIR_LEFT:
            for (var i = 0; i < activeblock.positionArr.length; i++) {
                //Rows
                for (var j = 0; j < activeblock.positionArr[i].length; j++) {
                    //Colls
                    if (activeblock.positionArr[i][j] == 1) {
                        //CHECK
                        for (var k = 0; k < tower.length; k++) {
                            if (tower[k].x == (activeblock.blockcoords.x + j - 1) && (tower[k].y == activeblock.blockcoords.y + i)) {
                                return false;
                            }
                        }
                    }
                }
            }
            break;
        case Game.DIR_RIGHT:
            for (var i = 0; i < activeblock.positionArr.length; i++) {
                //Rows
                for (var j = 0; j < activeblock.positionArr[i].length; j++) {
                    //Colls
                    if (activeblock.positionArr[i][j] == 1) {
                        //CHECK
                        for (var k = 0; k < tower.length; k++) {
                            if (tower[k].x == (activeblock.blockcoords.x + j + 1) && (tower[k].y == activeblock.blockcoords.y + i)) {
                                return false;
                            }
                        }
                    }
                }
            }
            break;
        case Game.DIR_BOTTOM:
            for (var i = 0; i < activeblock.positionArr.length; i++) {
                //Rows
                for (var j = 0; j < activeblock.positionArr[i].length; j++) {
                    //Colls
                    if (activeblock.positionArr[i][j] == 1) {
                        //CHECK
                        for (var k = 0; k < tower.length; k++) {
                            if ((tower[k].y == (activeblock.blockcoords.y + i + 1)) && (tower[k].x == activeblock.blockcoords.x + j)) {
                                return false;
                            }
                        }
                    }
                }
            }
            break;
        default:
            break;
        }
        return true;
    }
    function leftCheck() {
        var retval = true;
        for (var i = 0; i < activeblock.positionArr.length; i++) {
            //Rows
            for (var j = 0; j < activeblock.positionArr[i].length; j++) {
                //Colls
                if (activeblock.positionArr[i][j] == 1) {
                    //CHECK
                    if ((activeblock.blockcoords.x + j) <= 0) {
                        retval = false;
                        break;
                    }
                }
            }
        }
        return retval;
    }
    function rightCheck() {
        var retval = true;
        for (var i = 0; i < activeblock.positionArr.length; i++) {
            //Rows
            for (var j = 0; j < activeblock.positionArr[i].length; j++) {
                //Colls
                if (activeblock.positionArr[i][j] == 1) {
                    //CHECK
                    if ((activeblock.blockcoords.x + j + 1) >= Game.PLAYFIELDWIDTH) {
                        retval = false;
                        break;
                    }
                }
            }
        }
        return retval;
    }
    function linecheck(yPos) {
        var retVal = false;
        var lnCnt = 0;
        for (var i = 0; i < tower.length; i++) {
            if (tower[i].y == yPos) lnCnt++;
        }
        //		Debugger.log("lnCnt"+lnCnt);
        (lnCnt == 10) ? retVal = true: retVal = false;
        return retVal;
    }
    function setLevel(level) {
        if (dropInterval > Game.MAXDROPINTERVAL) {
            dropInterval = dropInterval - (100 * (level - 1));
            clearInterval(dropIntervalID);
            if (level > 1) {
                setDropInterval();
            }
        }
        //		Debugger.log("dropInterval"+dropInterval);
        $('#scorefield p:eq(0) span').text(level);
    }
    function setLines(lines) {
        $('#scorefield p:eq(1) span').text(stringDotify(lines));
    }
    function addAndShowLines(linecnt) {
        //		Debugger.log("addAndSwhoLines");
        lines += linecnt;
        score += getLinescore(linecnt);
        var lineMarker = new ScoreMarker(getLinescore(linecnt), 0, activeblock.blockcoords, activeblock.width, "#FFFFFF", 1000);
        setTimeout(function() {
            lineMarker.generate();
            lineMarker.animate();
        },
        1000);
        setLines(lines);
        setScore(score);
    }
    function addAndShowScore() {
        //		Debugger.log("addAndSchowScore");
        var scoreMarker = new ScoreMarker(activeblock.getCalculatedScore().blockscore, activeblock.getCalculatedScore().multiplier, activeblock.blockcoords, activeblock.width, activeblock.color, 0);
        scoreMarker.generate();
        scoreMarker.animate();
        score += activeblock.getCalculatedScore().score;
        setScore(score);
    }
    function getLinescore(linecnt) {
        switch (linecnt) {
        case 1:
            return 50;
            break;
        case 2:
            return 125;
            break;
        case 3:
            return 250;
            break;
        case 4:
            return 500;
            break;
        default:
            break;
        }
        return 0;

    }
    function setScore(score) {
        if (levelScoreDifference < score) {
            level += 1;
            setLevel(level);
            levelScoreDifference = levelScoreDifference * 2;
        }
        $('#scorefield p:eq(2) span').text(stringDotify(score));
    }
    function animatepageins() {
        if (checkPageins("UP") == false) {
            up = false;
            $('#up').css('display', 'none');
            $('#up').css('cursor', 'auto');
        } else {
            up = true;
            $('#up').css('display', 'block');
            $('#up').css('cursor', 'pointer');
        }
        if (checkPageins("DOWN") == false) {
            down = false;
            $('#down').css('display', 'none');
            $('#down').css('cursor', 'auto');
        } else {
            down = true;
            $('#down').css('display', 'block');
            $('#down').css('cursor', 'pointer');
        }
        Debugger.log("animatepageins2");
        $('#tbl-body').animate({
            top: -190 * page
        },
        {
            duration: 1000,
            easing: 'easeInOutQuint'
        });
    }
    function checkPageins(direction) {
        Debugger.log("checkPageins");
        if (direction == "UP") {
            if (page > 0) {
                return true;
            }
            return false;
        }
        if (direction == "DOWN") {
            if (page < Math.floor($('#tbl-body tr').size() / 10) - 1) {
                return true;
            }
            return false;
        }
    }
    function addmask() {
        $('#mask').css('display', 'block');
        $("#mask").animate({
            opacity: .5
        },
        {
            duration: 700,
            easing: 'easeOutExpo'
        });
    }
    function removemask() {
        $("#mask").animate({
            opacity: 0
        },
        {
            duration: 700,
            easing: 'easeOutExpo',
            complete: $('#mask').css('display', 'none')
        });
    }
    function getRandomblock() {
        var block = null;
        var rnd = randomFromTo(0, 17);
        //var rnd = 7;
        switch (rnd) {
        case 0:
            block = new Block([[0, 0, 1], [0, 0, 1], [1, 1, 1]], "#ff4df9", 10, {
                x: 1,
                y: 1
            },
            {
                x: 0,
                y: 0
            },
            Game.COUNTERCLOCKWISE)
            break;
        case 1:
            block = new Block([[0, 1, 0], [1, 1, 0], [0, 0, 0]], "#ff71b7", 6, {
                x: 1,
                y: 1
            },
            {
                x: 1,
                y: 1
            },
            Game.COUNTERCLOCKWISE)
            break;
        case 2:
            block = new Block([[0, 0, 1], [1, 1, 1], [0, 0, 0]], "#885fff", 8, {
                x: 2,
                y: 1
            },
            {
                x: 0,
                y: 1
            },
            Game.COUNTERCLOCKWISE)
            break;
        case 3:
            block = new Block([[1, 0, 0], [1, 1, 1], [0, 0, 0]], "#4dff98", 8, {
                x: 0,
                y: 1
            },
            {
                x: 1,
                y: 1
            },
            Game.CLOCKWISE)
            break;
        case 4:
            block = new Block([[0, 1, 0], [0, 1, 1], [0, 0, 0]], "#66ff4d", 6, {
                x: 0,
                y: 1
            },
            {
                x: 0,
                y: 1
            },
            Game.CLOCKWISE)
            break;
        case 5:
            block = new Block([[1, 0, 0], [1, 0, 0], [1, 1, 1]], "#ff4d4d", 10, {
                x: 1,
                y: 1
            },
            {
                x: 1,
                y: 0
            },
            Game.CLOCKWISE)
            break;
        case 6:
            block = new Block([[1, 1, 1], [1, 1, 1], [0, 0, 0]], "#ffc24d", 12, {
                x: 1,
                y: 0
            },
            {
                x: 0,
                y: 1
            },
            Game.ONEWISE, 1)
            break;
        case 7:
            block = new Block([[1, 1], [0, 0]], "#cd3737", 4, {
                x: 1,
                y: 0
            },
            {
                x: 1,
                y: 1
            },
            Game.COUNTERCLOCKWISE)
            break;
        case 8:
            block = new Block([[1]], "#ffffff", 1, {
                x: 0,
                y: 0
            },
            {
                x: 1,
                y: 1
            },
            Game.NOWISE)
            break;
        case 9:
            block = new Block([[1, 1], [1, 1]], "#2cf3ff", 8, {
                x: 1,
                y: 1
            },
            {
                x: 1,
                y: 1
            },
            Game.NOWISE)
            break;
        case 10:
            block = new Block([[0, 0, 0], [1, 1, 1], [0, 0, 0]], "#ffe92c", 6, {
                x: 1,
                y: 0
            },
            {
                x: 0,
                y: 0
            },
            Game.ONEWISE)
            break;
        case 11:
            block = new Block([[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], "#8f2cff", 8, {
                x: 2,
                y: 0
            },
            {
                x: 0,
                y: 0
            },
            Game.ONEWISE, 1)
            break;
        case 12:
            block = new Block([[0, 1, 0], [1, 1, 1], [0, 0, 0]], "#fdf4ac", 8, {
                x: 1,
                y: 1
            },
            {
                x: 0,
                y: 1
            },
            Game.CLOCKWISE)
            break;
        case 13:
            block = new Block([[0, 1, 0], [0, 1, 0], [1, 1, 1]], "#e29898", 10, {
                x: 1,
                y: 2
            },
            {
                x: 0,
                y: 0
            },
            Game.CLOCKWISE)

            break;
        case 14:
            block = new Block([[1, 0, 1], [1, 1, 1], [0, 0, 0]], "#18ff00", 10, {
                x: 1,
                y: 1
            },
            {
                x: 0,
                y: 1
            },
            Game.CLOCKWISE)
            break;
        case 15:
            block = new Block([[1, 0, 1], [1, 0, 1], [1, 1, 1]], "#bfbfbf", 14, {
                x: 1,
                y: 1
            },
            {
                x: 0,
                y: 0
            },
            Game.CLOCKWISE)
            break;
        case 16:
            block = new Block([[0, 1, 1], [1, 1, 0], [0, 0, 0]], "#1a3aff", 8, {
                x: 1,
                y: 1
            },
            {
                x: 0,
                y: 1
            },
            Game.ONEWISE, 1)
            break;
        case 17:
            block = new Block([[1, 1, 0], [0, 1, 1], [0, 0, 0]], "#ec1460", 8, {
                x: 1,
                y: 1
            },
            {
                x: 1,
                y: 1
            },
            Game.ONEWISE)
        default:
            break;
        }
        return block;
    }
    // ===================
    // = KEYBOARD EVENTS =
    // ===================
    $(document).keydown(function(event) {
		//prevent facebook from scrolling down on down key
		event.preventDefault();
        key_press_list[event.keyCode] = true;
        updateKeylist(key_press_list);
    });
    $(document).keyup(function(event) {
        key_press_list[event.keyCode] = false;
        updateKeylist(key_press_list);
    });
    function updateKeylist(key_press_list) {
        if (gameKeyboardEnabled) {
            if (key_press_list[38] == true) {
                activeblock.rotate();
                if (!rotationCheck()) activeblock.reRotate();
                activeblock.traceblockPositions();
            }
            //UP
            if (key_press_list[37] == true) {
                if (leftCheck() && towerCheck(Game.DIR_LEFT)) activeblock.move(activeblock.blockcoords.x - 1, activeblock.blockcoords.y);
            }
            //LEFT
            if (key_press_list[39] == true) {
                if (rightCheck() && towerCheck(Game.DIR_RIGHT)) activeblock.move(activeblock.blockcoords.x + 1, activeblock.blockcoords.y);
            }
            //RIGHT
            if (key_press_list[40] == true) {
                if (bottomCheck() && towerCheck(Game.DIR_BOTTOM)) {
                    activeblock.move(activeblock.blockcoords.x, activeblock.blockcoords.y + 1);
                } else {
                    addtotower();
                    fetchlines();
                    generatenewBlock();
                }
            }
            //DOWN
            if (key_press_list[32] == true) {
                //pause
                }
            //SPACE
            contextfaling.clearRect(0, 0, canvasfaling.width, canvasfaling.height);
            drawFallingBlock();
            drawTower();
        }
    }


}

// ===============
// = STATIC VARS =
// ===============
Game.PLAYFIELDWIDTH = 10;
Game.PLAYFIELDHEIGHT = 18;
Game.BLOCKWIDTHHEIGHT = 30;
Game.BLOCKOFFSET = 2;
Game.BLOCKCLEARRECTWIDTHHEIGHT = 10;
Game.PLAYFIELDSCORESEPPARATOR = 6;
Game.INITDROPINTERVAL = 1000;
Game.MAXDROPINTERVAL = 300;

Game.CLOCKWISE = "CLOCKWISE";
Game.COUNTERCLOCKWISE = "COUNTERCLOCKWISE";
Game.NOWISE = "NOWISE";
Game.ONEWISE = "ONEWISE";
Game.DIR_LEFT = "DIR_LEFT";
Game.DIR_RIGHT = "DIR_RIGHT";
Game.DIR_BOTTOM = "DIR_BOTTOM";
Game.DIR_ROTATION = "DIR_ROTATION";
